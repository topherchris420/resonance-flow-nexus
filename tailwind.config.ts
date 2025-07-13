import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				consciousness: {
					'focus-12': 'hsl(var(--focus-12))',
					'focus-15': 'hsl(var(--focus-15))',
					'focus-21': 'hsl(var(--focus-21))',
					'drr': 'hsl(var(--drr-active))',
					'quantum': 'hsl(var(--quantum-coherence))',
					'mandala': 'hsl(var(--mandala-primary))',
					'sacred': 'hsl(var(--mandala-secondary))',
					'golden': 'hsl(var(--golden-ratio))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'consciousness-pulse': {
					'0%, 100%': {
						opacity: '0.7',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.05)'
					}
				},
				'sacred-rotation': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'mandala-expand': {
					'0%': {
						transform: 'scale(0.8) rotate(0deg)',
						opacity: '0.5'
					},
					'50%': {
						transform: 'scale(1.1) rotate(180deg)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1) rotate(360deg)',
						opacity: '1'
					}
				},
				'quantum-shimmer': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'consciousness-pulse': 'consciousness-pulse 3s ease-in-out infinite',
				'sacred-rotation': 'sacred-rotation 20s linear infinite',
				'mandala-expand': 'mandala-expand 6s ease-in-out infinite',
				'quantum-shimmer': 'quantum-shimmer 4s ease-in-out infinite'
			},
			backgroundImage: {
				'consciousness': 'var(--gradient-consciousness)',
				'focus': 'var(--gradient-focus)',
				'sacred': 'var(--gradient-sacred)',
				'void': 'var(--gradient-void)'
			},
			boxShadow: {
				'consciousness': 'var(--shadow-consciousness)',
				'sacred': 'var(--shadow-sacred)',
				'void': 'var(--shadow-void)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
