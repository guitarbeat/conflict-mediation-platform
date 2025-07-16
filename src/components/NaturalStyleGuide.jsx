import React, { useState } from 'react';

const NaturalStyleGuide = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="container-natural py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-natural-3xl font-bold text-gradient">
                  Natural Design System
                </h1>
                <p className="text-natural-muted mt-2">
                  A cohesive, earth-inspired design language
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="btn-natural-outline"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        </header>

        <main className="container-natural py-8">
          {/* Color Palette Section */}
          <section className="section-natural">
            <h2 className="text-natural-2xl font-semibold mb-6">Color Palette</h2>
            
            {/* Primary Colors */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Forest Greens</h3>
              <div className="grid-natural-3 gap-4">
                <div className="card-natural p-4">
                  <div className="bg-forest-50 h-16 rounded-natural mb-3 border border-border"></div>
                  <p className="text-natural-sm font-medium">Forest 50</p>
                  <p className="text-natural-xs text-natural-muted">#f8faf6</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-forest-500 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Forest 500</p>
                  <p className="text-natural-xs text-natural-muted">#6b8e47</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-forest-900 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Forest 900</p>
                  <p className="text-natural-xs text-natural-muted">#2d3a20</p>
                </div>
              </div>
            </div>

            {/* Earth Tones */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Earth Tones</h3>
              <div className="grid-natural-3 gap-4">
                <div className="card-natural p-4">
                  <div className="bg-earth-100 h-16 rounded-natural mb-3 border border-border"></div>
                  <p className="text-natural-sm font-medium">Earth 100</p>
                  <p className="text-natural-xs text-natural-muted">#f8f6f2</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-earth-500 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Earth 500</p>
                  <p className="text-natural-xs text-natural-muted">#b5aa9a</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-earth-900 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Earth 900</p>
                  <p className="text-natural-xs text-natural-muted">#4a433b</p>
                </div>
              </div>
            </div>

            {/* Nature Tones */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Nature Tones</h3>
              <div className="grid-natural-3 gap-4">
                <div className="card-natural p-4">
                  <div className="bg-nature-100 h-16 rounded-natural mb-3 border border-border"></div>
                  <p className="text-natural-sm font-medium">Nature 100</p>
                  <p className="text-natural-xs text-natural-muted">#e0f4f0</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-nature-500 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Nature 500</p>
                  <p className="text-natural-xs text-natural-muted">#3ba88f</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-nature-900 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Nature 900</p>
                  <p className="text-natural-xs text-natural-muted">#1f4a3f</p>
                </div>
              </div>
            </div>

            {/* Warm Accents */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Warm Accents</h3>
              <div className="grid-natural-3 gap-4">
                <div className="card-natural p-4">
                  <div className="bg-warm-100 h-16 rounded-natural mb-3 border border-border"></div>
                  <p className="text-natural-sm font-medium">Warm 100</p>
                  <p className="text-natural-xs text-natural-muted">#fdf2e7</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-warm-500 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Warm 500</p>
                  <p className="text-natural-xs text-natural-muted">#e39849</p>
                </div>
                <div className="card-natural p-4">
                  <div className="bg-warm-900 h-16 rounded-natural mb-3"></div>
                  <p className="text-natural-sm font-medium">Warm 900</p>
                  <p className="text-natural-xs text-natural-muted">#74421d</p>
                </div>
              </div>
            </div>
          </section>

          <div className="divider-natural"></div>

          {/* Typography Section */}
          <section className="section-natural">
            <h2 className="text-natural-2xl font-semibold mb-6">Typography</h2>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-natural-3xl font-bold">Heading 1 - Large Display</h1>
                <p className="text-natural-xs text-natural-muted mt-1">3xl • Bold • -0.03em letter spacing</p>
              </div>
              
              <div>
                <h2 className="text-natural-2xl font-semibold">Heading 2 - Section Header</h2>
                <p className="text-natural-xs text-natural-muted mt-1">2xl • Semibold • -0.025em letter spacing</p>
              </div>
              
              <div>
                <h3 className="text-natural-xl font-medium">Heading 3 - Subsection</h3>
                <p className="text-natural-xs text-natural-muted mt-1">xl • Medium • -0.02em letter spacing</p>
              </div>
              
              <div>
                <p className="text-natural-base">
                  Body text with natural line height and spacing for optimal readability. 
                  This demonstrates the base font size with proper line height for comfortable reading.
                </p>
                <p className="text-natural-xs text-natural-muted mt-1">base • Normal • 1.6 line height</p>
              </div>
              
              <div>
                <p className="text-natural-sm text-natural-muted">
                  Small text for captions, labels, and secondary information.
                </p>
                <p className="text-natural-xs text-natural-muted mt-1">sm • Normal • 0.01em letter spacing</p>
              </div>
            </div>
          </section>

          <div className="divider-natural"></div>

          {/* Components Section */}
          <section className="section-natural">
            <h2 className="text-natural-2xl font-semibold mb-6">Components</h2>
            
            {/* Buttons */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-natural-primary">Primary Button</button>
                <button className="btn-natural-secondary">Secondary Button</button>
                <button className="btn-natural-outline">Outline Button</button>
              </div>
            </div>

            {/* Cards */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Cards</h3>
              <div className="grid-natural-2 gap-6">
                <div className="card-natural p-6 interactive-natural">
                  <h4 className="text-natural-lg font-semibold mb-2">Standard Card</h4>
                  <p className="text-natural-muted mb-4">
                    A basic card with natural styling and hover effects.
                  </p>
                  <button className="btn-natural-outline">Learn More</button>
                </div>
                
                <div className="card-natural-elevated p-6 interactive-natural">
                  <h4 className="text-natural-lg font-semibold mb-2">Elevated Card</h4>
                  <p className="text-natural-muted mb-4">
                    An elevated card with enhanced shadow and prominence.
                  </p>
                  <button className="btn-natural-primary">Get Started</button>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Status Indicators</h3>
              <div className="flex flex-wrap gap-4">
                <div className="status-success px-3 py-2 rounded-natural-sm">
                  ✓ Success Status
                </div>
                <div className="status-warning px-3 py-2 rounded-natural-sm">
                  ⚠ Warning Status
                </div>
                <div className="status-error px-3 py-2 rounded-natural-sm">
                  ✗ Error Status
                </div>
                <div className="status-info px-3 py-2 rounded-natural-sm">
                  ℹ Info Status
                </div>
              </div>
            </div>

            {/* Form Elements */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Form Elements</h3>
              <div className="form-natural max-w-md">
                <div className="form-group-natural">
                  <label className="label-natural">Email Address</label>
                  <input 
                    type="email" 
                    className="input-natural" 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="form-group-natural">
                  <label className="label-natural">Message</label>
                  <textarea 
                    className="input-natural" 
                    rows="4" 
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button className="btn-natural-primary w-full">
                  Send Message
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Progress Indicators</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-natural-sm mb-2">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="progress-natural">
                    <div className="progress-natural-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="loading-natural bg-muted h-4 rounded-natural">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </section>

          <div className="divider-natural"></div>

          {/* Spacing & Layout */}
          <section className="section-natural">
            <h2 className="text-natural-2xl font-semibold mb-6">Spacing & Layout</h2>
            
            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Spacing Scale</h3>
              <div className="space-y-2">
                {[
                  { name: 'xs', size: '4px', class: 'w-1' },
                  { name: 'sm', size: '8px', class: 'w-2' },
                  { name: 'md', size: '16px', class: 'w-4' },
                  { name: 'lg', size: '24px', class: 'w-6' },
                  { name: 'xl', size: '32px', class: 'w-8' },
                  { name: '2xl', size: '48px', class: 'w-12' },
                ].map(({ name, size, class: className }) => (
                  <div key={name} className="flex items-center gap-4">
                    <div className={`${className} h-4 bg-primary rounded-natural-sm`}></div>
                    <span className="text-natural-sm font-medium w-8">{name}</span>
                    <span className="text-natural-xs text-natural-muted">{size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-natural-lg font-medium mb-4">Border Radius</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'xs', class: 'rounded-natural-xs' },
                  { name: 'sm', class: 'rounded-natural-sm' },
                  { name: 'md', class: 'rounded-natural-md' },
                  { name: 'lg', class: 'rounded-natural-lg' },
                ].map(({ name, class: className }) => (
                  <div key={name} className="text-center">
                    <div className={`w-16 h-16 bg-primary mx-auto mb-2 ${className}`}></div>
                    <p className="text-natural-xs text-natural-muted">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider-natural"></div>

          {/* Shadows & Effects */}
          <section className="section-natural">
            <h2 className="text-natural-2xl font-semibold mb-6">Shadows & Effects</h2>
            
            <div className="grid-natural-2 gap-6">
              {[
                { name: 'Small Shadow', class: 'shadow-natural-sm' },
                { name: 'Default Shadow', class: 'shadow-natural' },
                { name: 'Medium Shadow', class: 'shadow-natural-md' },
                { name: 'Large Shadow', class: 'shadow-natural-lg' },
              ].map(({ name, class: className }) => (
                <div key={name} className={`bg-card p-6 rounded-natural ${className}`}>
                  <h4 className="text-natural-base font-medium">{name}</h4>
                  <p className="text-natural-sm text-natural-muted mt-1">
                    Demonstrates the {name.toLowerCase()} effect
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted border-t border-border mt-16">
          <div className="container-natural py-8">
            <div className="text-center">
              <p className="text-natural-muted">
                Natural Design System • Built with care for the environment and user experience
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NaturalStyleGuide;