import React, { useState, useRef, useEffect } from 'react';

const EnhancedNavigation = ({ currentPage, onNavigate, showSearch = true, showHelp = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'conflict resolution',
    'mediation techniques',
    'communication skills'
  ]);
  const [searchSuggestions] = useState([
    'conflict resolution strategies',
    'mediation techniques for workplace',
    'communication skills training',
    'negotiation methods',
    'conflict prevention',
    'team building exercises'
  ]);
  const searchRef = useRef(null);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowAutocomplete(query.length > 0);
  };

  // Handle search submission
  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item !== query);
        return [query, ...filtered.slice(0, 4)];
      });
      setSearchQuery('');
      setShowAutocomplete(false);
      // Navigate to search results
      onNavigate('search', { query });
    }
  };

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearchSubmit(searchQuery);
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
      setSearchQuery('');
    }
  };

  // Filter suggestions based on search query
  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 hover-lift focus-ring touch-target"
              aria-label="Go to home page"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-heading-md font-semibold text-foreground hidden sm:block">
                Mediation Hub
              </span>
            </button>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li className="breadcrumb-item">
                  <button
                    onClick={() => onNavigate('home')}
                    className="breadcrumb-link hover-slide"
                  >
                    Home
                  </button>
                  <span className="breadcrumb-separator">/</span>
                </li>
                {currentPage !== 'home' && (
                  <li className="breadcrumb-item">
                    <span className="breadcrumb-current capitalize">
                      {currentPage.replace('-', ' ')}
                    </span>
                  </li>
                )}
              </ol>
            </nav>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4" ref={searchRef}>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search mediation resources..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className="search-input focus-ring"
                  aria-label="Search"
                />
                <svg className="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                {/* Autocomplete Dropdown */}
                {showAutocomplete && (
                  <div className="autocomplete-dropdown">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="p-2 border-b border-border">
                        <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                          Recent Searches
                        </div>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(search)}
                            className="autocomplete-item w-full text-left"
                            aria-label={`Search for ${search}`}
                          >
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{search}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Search Suggestions */}
                    {filteredSuggestions.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                          Suggestions
                        </div>
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSubmit(suggestion)}
                            className="autocomplete-item w-full text-left"
                            aria-label={`Search for ${suggestion}`}
                          >
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span>{suggestion}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No Results */}
                    {filteredSuggestions.length === 0 && searchQuery.length > 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        <p className="text-sm">No results found for "{searchQuery}"</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Help Button */}
            {showHelp && (
              <button
                onClick={() => onNavigate('help')}
                className="tooltip-container touch-target p-2 rounded-lg hover:bg-muted focus-ring"
                aria-label="Get help"
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="tooltip tooltip-delayed">Get help and support</span>
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => onNavigate('notifications')}
              className="tooltip-container touch-target p-2 rounded-lg hover:bg-muted focus-ring relative"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5L9 15H4.5l5.5 4.5V19.5z" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse"></span>
              <span className="tooltip tooltip-delayed">View notifications</span>
            </button>

            {/* User Menu */}
            <button
              onClick={() => onNavigate('profile')}
              className="tooltip-container touch-target p-2 rounded-lg hover:bg-muted focus-ring"
              aria-label="User profile"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">U</span>
              </div>
              <span className="tooltip tooltip-delayed">User profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden border-t border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('menu')}
              className="touch-target p-2 rounded-lg hover:bg-muted focus-ring"
              aria-label="Open mobile menu"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Mobile Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="capitalize">{currentPage.replace('-', ' ')}</span>
            </div>

            <button
              onClick={() => onNavigate('search')}
              className="touch-target p-2 rounded-lg hover:bg-muted focus-ring"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavigation;