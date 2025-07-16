// Natural Design System Configuration
// This file defines the core design tokens for consistent styling across the application

export const designSystem = {
    // Enhanced Natural Color Palette - Earth, Forest & Stone Tones
    colors: {
        // Primary palette - Forest greens with more natural variations
        forest: {
            50: '#f8faf6',   // morning mist
            100: '#f0f4ea',  // pale sage
            200: '#e1ebd4',  // light sage
            300: '#c8d9b3',  // medium sage
            400: '#a8c285',  // sage green
            500: '#6b8e47',  // primary forest
            600: '#5a7a3c',  // deep forest
            700: '#4a6332',  // darker forest
            800: '#3d5129',  // deepest forest
            900: '#2d3a20',  // forest night
            950: '#1f2817',  // deepest night
        },

        // Secondary palette - Warm earth and stone tones
        earth: {
            50: '#fdfcfa',   // warm cream
            100: '#f8f6f2',  // light cream
            200: '#f0ede7',  // warm beige
            300: '#e5e0d7',  // light stone
            400: '#d1c9bc',  // medium stone
            500: '#b5aa9a',  // warm stone
            600: '#9a8f7e',  // taupe
            700: '#7d7265',  // dark taupe
            800: '#635a4f',  // deeper taupe
            900: '#4a433b',  // darkest taupe
            950: '#332e28',  // earth night
        },

        // Accent palette - Natural water and sky tones
        nature: {
            50: '#f0faf8',   // morning dew
            100: '#e0f4f0',  // pale mint
            200: '#c2e9e0',  // light mint
            300: '#94d9c8',  // medium mint
            400: '#5fc4ab',  // mint green
            500: '#3ba88f',  // primary teal
            600: '#2d8a73',  // deep teal
            700: '#26705c',  // darker teal
            800: '#225a4b',  // deepest teal
            900: '#1f4a3f',  // teal night
            950: '#163530',  // deepest night
        },

        // Warm accent palette - Sunset and clay tones
        warm: {
            50: '#fef9f5',   // warm white
            100: '#fdf2e7',  // cream
            200: '#fae4ca',  // light peach
            300: '#f5d0a3',  // peach
            400: '#edb572',  // warm gold
            500: '#e39849',  // golden
            600: '#d17d2b',  // amber
            700: '#b06420',  // deep amber
            800: '#8f501e',  // burnt amber
            900: '#74421d',  // darkest amber
            950: '#3f220e',  // amber night
        },

        // Cool accent palette - Lavender and stone
        cool: {
            50: '#f9f8fc',   // lavender mist
            100: '#f3f1f8',  // pale lavender
            200: '#e8e4f0',  // light lavender
            300: '#d6cfe4',  // medium lavender
            400: '#bfb3d4',  // lavender
            500: '#a394c0',  // deep lavender
            600: '#8a7aa8',  // purple stone
            700: '#73658a',  // dark purple
            800: '#5f5472',  // deeper purple
            900: '#4f465e',  // darkest purple
            950: '#2d2833',  // purple night
        },

        // Enhanced semantic colors with natural tones
        semantic: {
            success: '#6b8e47',      // forest green
            successLight: '#a8c285', // light sage
            warning: '#e39849',      // golden amber
            warningLight: '#f5d0a3', // light peach
            error: '#c53030',        // natural red
            errorLight: '#feb2b2',   // light coral
            info: '#3ba88f',         // teal
            infoLight: '#94d9c8',    // light mint
        },

        // Neutral grays with warm undertones
        neutral: {
            50: '#fafaf9',   // warm white
            100: '#f5f5f4',  // light warm gray
            200: '#e7e5e4',  // warm gray
            300: '#d6d3d1',  // medium warm gray
            400: '#a8a29e',  // warm gray
            500: '#78716c',  // medium gray
            600: '#57534e',  // dark gray
            700: '#44403c',  // darker gray
            800: '#292524',  // darkest gray
            900: '#1c1917',  // near black
            950: '#0c0a09',  // true black
        }
    },

    // Enhanced Typography Scale with Natural Hierarchy
    typography: {
        fontFamily: {
            // Primary sans-serif stack - clean and readable
            sans: [
                'Inter Variable',
                'Inter',
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'system-ui',
                'sans-serif'
            ],
            // Serif stack for elegant headings and emphasis
            serif: [
                'Crimson Text',
                'Crimson Pro',
                'Charter',
                'Georgia',
                'Times New Roman',
                'serif'
            ],
            // Monospace for code and technical content
            mono: [
                'JetBrains Mono Variable',
                'JetBrains Mono',
                'SF Mono',
                'Monaco',
                'Inconsolata',
                'Roboto Mono',
                'Consolas',
                'monospace'
            ],
            // Display font for large headings
            display: [
                'Inter Variable',
                'Inter',
                'system-ui',
                'sans-serif'
            ]
        },
        fontSize: {
            // Micro text
            xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
            // Small text
            sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
            // Body text
            base: ['1rem', { lineHeight: '1.6rem', letterSpacing: '0' }],
            // Large body text
            lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
            // Small headings
            xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
            // Medium headings
            '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
            // Large headings
            '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
            // Extra large headings
            '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.035em' }],
            // Display headings
            '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.04em' }],
            '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.045em' }],
            '7xl': ['4.5rem', { lineHeight: '4.75rem', letterSpacing: '-0.05em' }],
        },
        fontWeight: {
            thin: '100',
            extralight: '200',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
            black: '900',
        },
        // Line height scale for better typography control
        lineHeight: {
            none: '1',
            tight: '1.25',
            snug: '1.375',
            normal: '1.5',
            relaxed: '1.625',
            loose: '2',
        },
        // Letter spacing for fine typography control
        letterSpacing: {
            tighter: '-0.05em',
            tight: '-0.025em',
            normal: '0em',
            wide: '0.025em',
            wider: '0.05em',
            widest: '0.1em',
        }
    },

    // Enhanced Spacing Scale (based on 4px grid with natural rhythm)
    spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',  // 2px - hairline
        1: '0.25rem',     // 4px - minimal
        1.5: '0.375rem',  // 6px - tight
        2: '0.5rem',      // 8px - small
        2.5: '0.625rem',  // 10px - compact
        3: '0.75rem',     // 12px - cozy
        3.5: '0.875rem',  // 14px - snug
        4: '1rem',        // 16px - base
        5: '1.25rem',     // 20px - comfortable
        6: '1.5rem',      // 24px - spacious
        7: '1.75rem',     // 28px - roomy
        8: '2rem',        // 32px - generous
        9: '2.25rem',     // 36px - loose
        10: '2.5rem',     // 40px - relaxed
        11: '2.75rem',    // 44px - open
        12: '3rem',       // 48px - airy
        14: '3.5rem',     // 56px - expansive
        16: '4rem',       // 64px - wide
        18: '4.5rem',     // 72px - broad
        20: '5rem',       // 80px - vast
        24: '6rem',       // 96px - spacious
        28: '7rem',       // 112px - grand
        32: '8rem',       // 128px - massive
        36: '9rem',       // 144px - enormous
        40: '10rem',      // 160px - gigantic
        44: '11rem',      // 176px - colossal
        48: '12rem',      // 192px - immense
        52: '13rem',      // 208px - tremendous
        56: '14rem',      // 224px - huge
        60: '15rem',      // 240px - giant
        64: '16rem',      // 256px - massive
        72: '18rem',      // 288px - enormous
        80: '20rem',      // 320px - gigantic
        96: '24rem',      // 384px - colossal
    },

    // Natural Border Radius Scale - organic curves
    borderRadius: {
        none: '0',
        xs: '0.125rem',   // 2px - subtle
        sm: '0.375rem',   // 6px - gentle
        DEFAULT: '0.5rem', // 8px - natural
        md: '0.75rem',    // 12px - soft
        lg: '1rem',       // 16px - rounded
        xl: '1.25rem',    // 20px - curved
        '2xl': '1.5rem',  // 24px - flowing
        '3xl': '2rem',    // 32px - organic
        full: '9999px',   // perfect circle
    },

    // Enhanced Shadow Scale with natural depth
    boxShadow: {
        // Subtle shadows
        xs: '0 1px 2px 0 rgba(31, 40, 23, 0.04)',
        sm: '0 1px 3px 0 rgba(31, 40, 23, 0.08), 0 1px 2px -1px rgba(31, 40, 23, 0.04)',
        // Standard shadows
        DEFAULT: '0 1px 3px 0 rgba(31, 40, 23, 0.1), 0 1px 2px -1px rgba(31, 40, 23, 0.06)',
        md: '0 4px 6px -1px rgba(31, 40, 23, 0.1), 0 2px 4px -2px rgba(31, 40, 23, 0.06)',
        // Elevated shadows
        lg: '0 10px 15px -3px rgba(31, 40, 23, 0.1), 0 4px 6px -4px rgba(31, 40, 23, 0.05)',
        xl: '0 20px 25px -5px rgba(31, 40, 23, 0.1), 0 8px 10px -6px rgba(31, 40, 23, 0.04)',
        '2xl': '0 25px 50px -12px rgba(31, 40, 23, 0.15)',
        // Special shadows
        inner: 'inset 0 2px 4px 0 rgba(31, 40, 23, 0.06)',
        outline: '0 0 0 3px rgba(107, 142, 71, 0.1)',
        // Natural glow effects
        glow: '0 0 20px rgba(107, 142, 71, 0.15)',
        'glow-lg': '0 0 40px rgba(107, 142, 71, 0.2)',
        // Warm shadows for accent elements
        warm: '0 4px 6px -1px rgba(227, 152, 73, 0.1), 0 2px 4px -2px rgba(227, 152, 73, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(227, 152, 73, 0.1), 0 4px 6px -4px rgba(227, 152, 73, 0.05)',
    },

    // Natural Transitions and Animations
    transitions: {
        // Duration scale
        duration: {
            fast: '150ms',
            normal: '200ms',
            slow: '300ms',
            slower: '500ms',
            slowest: '1000ms',
        },
        // Easing functions for natural movement
        easing: {
            linear: 'linear',
            ease: 'ease',
            'ease-in': 'ease-in',
            'ease-out': 'ease-out',
            'ease-in-out': 'ease-in-out',
            // Natural cubic-bezier curves
            natural: 'cubic-bezier(0.4, 0, 0.2, 1)',
            'natural-in': 'cubic-bezier(0.4, 0, 1, 1)',
            'natural-out': 'cubic-bezier(0, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }
    },

    // Component-specific tokens
    components: {
        button: {
            height: {
                sm: '2rem',     // 32px
                md: '2.5rem',   // 40px
                lg: '3rem',     // 48px
            },
            padding: {
                sm: '0.5rem 1rem',
                md: '0.75rem 1.5rem',
                lg: '1rem 2rem',
            }
        },
        input: {
            height: {
                sm: '2rem',
                md: '2.5rem',
                lg: '3rem',
            }
        },
        card: {
            padding: {
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
            }
        }
    }
};

// Utility functions for consistent styling
export const getColorValue = (colorPath) => {
    const [palette, shade] = colorPath.split('.');
    return designSystem.colors[palette]?.[shade] || colorPath;
};

export const getSpacingValue = (size) => {
    return designSystem.spacing[size] || size;
};

export const getBorderRadiusValue = (size) => {
    return designSystem.borderRadius[size] || size;
};

// Enhanced utility functions for better developer experience
export const createColorClasses = (palette) => {
    const colors = designSystem.colors[palette];
    if (!colors) return {};

    return Object.entries(colors).reduce((acc, [shade, value]) => {
        acc[`${palette}-${shade}`] = value;
        return acc;
    }, {});
};

export const getTypographyStyles = (size) => {
    const typography = designSystem.typography.fontSize[size];
    if (!typography) return {};

    const [fontSize, options] = typography;
    return {
        fontSize,
        lineHeight: options.lineHeight,
        letterSpacing: options.letterSpacing || '0',
    };
};

export const getShadowValue = (size) => {
    return designSystem.boxShadow[size] || designSystem.boxShadow.DEFAULT;
};

export const getTransition = (property = 'all', duration = 'normal', easing = 'natural') => {
    const dur = designSystem.transitions.duration[duration] || duration;
    const ease = designSystem.transitions.easing[easing] || easing;
    return `${property} ${dur} ${ease}`;
};

// Theme configuration helpers
export const createThemeConfig = () => {
    return {
        colors: designSystem.colors,
        spacing: designSystem.spacing,
        borderRadius: designSystem.borderRadius,
        boxShadow: designSystem.boxShadow,
        fontSize: Object.fromEntries(
            Object.entries(designSystem.typography.fontSize).map(([key, [size]]) => [key, size])
        ),
        fontFamily: designSystem.typography.fontFamily,
        fontWeight: designSystem.typography.fontWeight,
        lineHeight: designSystem.typography.lineHeight,
        letterSpacing: designSystem.typography.letterSpacing,
        transitionDuration: designSystem.transitions.duration,
        transitionTimingFunction: designSystem.transitions.easing,
    };
};

// CSS custom properties generator
export const generateCSSCustomProperties = () => {
    const properties = [];

    // Colors
    Object.entries(designSystem.colors).forEach(([palette, shades]) => {
        Object.entries(shades).forEach(([shade, value]) => {
            properties.push(`--color-${palette}-${shade}: ${value};`);
        });
    });

    // Spacing
    Object.entries(designSystem.spacing).forEach(([key, value]) => {
        properties.push(`--space-${key}: ${value};`);
    });

    // Border radius
    Object.entries(designSystem.borderRadius).forEach(([key, value]) => {
        properties.push(`--radius-${key}: ${value};`);
    });

    // Shadows
    Object.entries(designSystem.boxShadow).forEach(([key, value]) => {
        properties.push(`--shadow-${key}: ${value};`);
    });

    return properties.join('\n  ');
};

// Component style generators
export const buttonStyles = {
    primary: {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius)',
        padding: designSystem.components.button.padding.md,
        fontWeight: designSystem.typography.fontWeight.medium,
        transition: getTransition(),
    },
    secondary: {
        backgroundColor: 'var(--secondary)',
        color: 'var(--secondary-foreground)',
        border: '1px solid var(--secondary)',
        borderRadius: 'var(--radius)',
        padding: designSystem.components.button.padding.md,
        fontWeight: designSystem.typography.fontWeight.medium,
        transition: getTransition(),
    },
    outline: {
        backgroundColor: 'transparent',
        color: 'var(--primary)',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius)',
        padding: designSystem.components.button.padding.md,
        fontWeight: designSystem.typography.fontWeight.medium,
        transition: getTransition(),
    },
};

export const cardStyles = {
    default: {
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow)',
        transition: getTransition(),
    },
    elevated: {
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        transition: getTransition('all', 'slow'),
    },
};

// Export the complete design system
export default designSystem;