import { useCallback, useState } from 'react';

const HEART_RATE_SERVICE = 'heart_rate';
const HEART_RATE_MEASUREMENT = 'heart_rate_measurement';

const parseHeartRateMeasurement = (value: DataView): number => {
  const flags = value.getUint8(0);
  const isUint16 = (flags & 0x01) === 0x01;

  return isUint16 ? value.getUint16(1, true) : value.getUint8(1);
};

export const useHeartRateSensor = () => {
  const [heartRate, setHeartRate] = useState<number | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const isAvailable = typeof navigator !== 'undefined' && Boolean(navigator.bluetooth);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError('Web Bluetooth is not available in this browser.');
      return;
    }

    try {
      setError(undefined);
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [HEART_RATE_SERVICE] }],
        optionalServices: [HEART_RATE_SERVICE],
      });

      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Heart-rate sensor did not expose a GATT server.');
      }

      const service = await server.getPrimaryService(HEART_RATE_SERVICE);
      const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT);

      characteristic.addEventListener('characteristicvaluechanged', event => {
        const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
        if (target.value) {
          setHeartRate(parseHeartRateMeasurement(target.value));
        }
      });

      await characteristic.startNotifications();
      setIsConnected(true);
    } catch (sensorError) {
      setIsConnected(false);
      setError(sensorError instanceof Error ? sensorError.message : 'Unable to connect heart-rate sensor.');
    }
  }, []);

  return {
    heartRate,
    isAvailable,
    isConnected,
    error,
    connect,
  };
};
