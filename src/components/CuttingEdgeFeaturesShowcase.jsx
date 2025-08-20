import React, { useState, useEffect } from 'react';

const CuttingEdgeFeaturesShowcase = () => {
  const [notifications, setNotifications] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const [collaborationActive, setCollaborationActive] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memory: 45,
    network: 120
  });

  // Smart Notifications System
  const addNotification = (priority, title, message, actions = []) => {
    const id = Date.now();
    const notification = {
      id,
      priority,
      title,
      message,
      actions,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(200, prev.network + (Math.random() - 0.5) * 20))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate sync status changes
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const statuses = ['synced', 'syncing', 'error', 'offline'];
      setSyncStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 8000);

    return () => clearInterval(syncInterval);
  }, []);

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced': return 'All devices synced';
      case 'syncing': return 'Syncing...';
      case 'error': return 'Sync error';
      case 'offline': return 'Offline mode';
      default: return 'Unknown status';
    }
  };

  const getSyncStatusClass = () => {
    switch (syncStatus) {
      case 'synced': return 'success';
      case 'syncing': return 'syncing';
      case 'error': return 'error';
      case 'offline': return 'offline';
      default: return 'success';
    }
  };

  const getPerformanceClass = (value, good, warning) => {
    if (value >= good) return 'good';
    if (value >= warning) return 'warning';
    return 'poor';
  };

  return (
    <div className="cutting-edge-showcase">
      {/* Smart Notifications Center */}
      <div className="notification-center">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item priority-${notification.priority}`}
          >
            <div className="notification-header">
              <div className="notification-title">
                <span>{notification.title}</span>
                <span className={`notification-priority ${notification.priority}`}>
                  {notification.priority}
                </span>
              </div>
              <div className="notification-controls">
                <button 
                  className="notification-close"
                  onClick={() => removeNotification(notification.id)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="notification-content">
              <div className="notification-message">{notification.message}</div>
              {notification.actions.length > 0 && (
                <div className="notification-actions">
                  {notification.actions.map((action, index) => (
                    <button 
                      key={index}
                      className={`notification-btn ${action.primary ? 'primary' : ''}`}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="notification-progress">
              <div 
                className={`notification-progress-fill ${notification.priority}`}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Sync Status Indicator */}
      <div className={`sync-status ${getSyncStatusClass()}`}>
        <div className="sync-indicator" />
        <span className="sync-text">{getSyncStatusText()}</span>
        <div className="device-list">
          <div className="device-item">
            <div className="device-icon">💻</div>
            <span className="device-name">MacBook Pro</span>
            <div className="device-status" />
          </div>
          <div className="device-item">
            <div className="device-icon">📱</div>
            <span className="device-name">iPhone</span>
            <div className="device-status" />
          </div>
          <div className="device-item">
            <div className="device-icon">🖥️</div>
            <span className="device-name">Desktop</span>
            <div className="device-status" />
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <div className="performance-monitor">
        <div className="performance-title">Performance</div>
        <div className="performance-metric">
          <span className="performance-label">FPS</span>
          <span className={`performance-value ${getPerformanceClass(performanceMetrics.fps, 55, 45)}`}>
            {Math.round(performanceMetrics.fps)}
          </span>
        </div>
        <div className="performance-metric">
          <span className="performance-label">Memory</span>
          <span className={`performance-value ${getPerformanceClass(performanceMetrics.memory, 60, 40)}`}>
            {Math.round(performanceMetrics.memory)}%
          </span>
        </div>
        <div className="performance-metric">
          <span className="performance-label">Network</span>
          <span className={`performance-value ${getPerformanceClass(performanceMetrics.network, 150, 100)}`}>
            {Math.round(performanceMetrics.network)}ms
          </span>
        </div>
      </div>

      {/* Personalization Panel */}
      <div className={`personalization-panel ${personalizationOpen ? '' : 'collapsed'}`}>
        <button 
          className="personalization-toggle"
          onClick={() => setPersonalizationOpen(!personalizationOpen)}
        >
          {personalizationOpen ? '×' : '⚙️'}
        </button>
        
        {personalizationOpen && (
          <>
            <div className="personalization-option">
              <div className="personalization-label">
                Theme
                <span className="personalization-preview">Preview</span>
              </div>
              <div className="theme-switcher">
                <div className="theme-option active">Light</div>
                <div className="theme-option">Dark</div>
                <div className="theme-option">Auto</div>
              </div>
            </div>

            <div className="personalization-option">
              <div className="personalization-label">
                Color Scheme
                <span className="personalization-preview">Preview</span>
              </div>
              <div className="color-customization">
                <div className="color-picker">
                  <div className="color-option active" style={{ background: '#6b8e47' }} />
                  <div className="color-option" style={{ background: '#3b82f6' }} />
                  <div className="color-option" style={{ background: '#8b5cf6' }} />
                  <div className="color-option" style={{ background: '#ef4444' }} />
                </div>
              </div>
            </div>

            <div className="personalization-option">
              <div className="personalization-label">
                Layout
                <span className="personalization-preview">Preview</span>
              </div>
              <div className="layout-options">
                <div className="layout-option">
                  <input type="radio" name="layout" id="compact" defaultChecked />
                  <label htmlFor="compact">Compact</label>
                </div>
                <div className="layout-option">
                  <input type="radio" name="layout" id="comfortable" />
                  <label htmlFor="comfortable">Comfortable</label>
                </div>
                <div className="layout-option">
                  <input type="radio" name="layout" id="spacious" />
                  <label htmlFor="spacious">Spacious</label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Keyboard Shortcuts Trigger */}
      <button 
        className="keyboard-shortcuts-trigger"
        onClick={() => setShowShortcuts(true)}
      >
        ⌨️
        <div className="keyboard-hint">Keyboard Shortcuts</div>
      </button>

      {/* Keyboard Shortcuts Overlay */}
      {showShortcuts && (
        <div className="keyboard-shortcuts-overlay active">
          <div className="keyboard-shortcuts-modal">
            <div className="keyboard-shortcuts-header">
              <h2 className="keyboard-shortcuts-title">Keyboard Shortcuts</h2>
              <p className="keyboard-shortcuts-subtitle">Master your workflow with these time-saving shortcuts</p>
            </div>
            
            <div className="keyboard-shortcuts-content">
              <div className="shortcuts-category">
                <h3 className="shortcuts-category-title">Navigation</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Go to next step</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">→</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Go to previous step</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">←</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Save progress</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">⌘</span>
                      <span className="shortcut-key">S</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shortcuts-category">
                <h3 className="shortcuts-category-title">Actions</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Submit form</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">⌘</span>
                      <span className="shortcut-key">↵</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Reset form</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">⌘</span>
                      <span className="shortcut-key">R</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Toggle help</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">?</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shortcuts-category">
                <h3 className="shortcuts-category-title">System</h3>
                <div className="shortcuts-list">
                  <div className="shortcut-item">
                    <span className="shortcut-description">Show shortcuts</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">⌘</span>
                      <span className="shortcut-key">/</span>
                    </div>
                  </div>
                  <div className="shortcut-item">
                    <span className="shortcut-description">Toggle personalization</span>
                    <div className="shortcut-keys">
                      <span className="shortcut-key">⌘</span>
                      <span className="shortcut-key">P</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Showcase Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-display-xl text-primary-700 mb-4">
            Cutting-Edge Features
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the future of user experience with our advanced features that 
            set new standards for professional applications.
          </p>
        </div>

        {/* Smart Notifications Demo */}
        <div className="mb-12">
          <h3 className="text-heading-lg mb-6">Smart Notifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              className="btn btn-primary"
              onClick={() => addNotification('critical', 'System Alert', 'Critical system update required', [
                { label: 'Update Now', primary: true, onClick: () => console.log('Update clicked') },
                { label: 'Later', onClick: () => console.log('Later clicked') }
              ])}
            >
              Critical Alert
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => addNotification('high', 'Security Notice', 'New login detected from unknown device', [
                { label: 'Review', primary: true, onClick: () => console.log('Review clicked') },
                { label: 'Dismiss', onClick: () => console.log('Dismiss clicked') }
              ])}
            >
              Security Notice
            </button>
            <button 
              className="btn btn-accent"
              onClick={() => addNotification('normal', 'Update Available', 'New features are ready to explore', [
                { label: 'Learn More', primary: true, onClick: () => console.log('Learn more clicked') }
              ])}
            >
              Update Available
            </button>
            <button 
              className="btn btn-muted"
              onClick={() => addNotification('low', 'Daily Summary', 'Your daily activity summary is ready', [
                { label: 'View', primary: true, onClick: () => console.log('View clicked') }
              ])}
            >
              Daily Summary
            </button>
          </div>
        </div>

        {/* Intelligent Forms Demo */}
        <div className="mb-12">
          <h3 className="text-heading-lg mb-6">Intelligent Forms</h3>
          <div className="max-w-2xl mx-auto">
            <div className="smart-form">
              <div className="smart-form-field">
                <label className="form-label">Project Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="input w-full"
                    placeholder="Enter project name..."
                  />
                  <div className="form-intelligence">
                    💡
                    <div className="intelligence-tooltip">
                      AI-powered suggestions available
                    </div>
                  </div>
                </div>
                <div className="smart-suggestions">
                  <div className="suggestion-title">Recent Projects</div>
                  <div className="suggestion-tags">
                    <span className="suggestion-tag">Conflict Resolution Platform</span>
                    <span className="suggestion-tag">Mediation App</span>
                    <span className="suggestion-tag">Dispute Management</span>
                  </div>
                </div>
              </div>

              <div className="smart-form-field">
                <label className="form-label">Category</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="input w-full"
                    placeholder="Select category..."
                  />
                  <div className="autocomplete-dropdown">
                    <div className="autocomplete-item">
                      <div className="autocomplete-icon">🏢</div>
                      <div className="autocomplete-text">
                        <span className="autocomplete-highlight">Work</span>place Conflict
                      </div>
                    </div>
                    <div className="autocomplete-item">
                      <div className="autocomplete-icon">👥</div>
                      <div className="autocomplete-text">
                        <span className="autocomplete-highlight">Work</span>ing Relationship
                      </div>
                    </div>
                    <div className="autocomplete-item">
                      <div className="autocomplete-icon">💼</div>
                      <div className="autocomplete-text">
                        <span className="autocomplete-highlight">Work</span>load Distribution
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Demo */}
        <div className="mb-12">
          <h3 className="text-heading-lg mb-6">Real-Time Collaboration</h3>
          <div className="max-w-4xl mx-auto">
            <div className={`collaboration-container ${collaborationActive ? 'active' : ''}`}>
              <div className="collaboration-header">
                <div className="collaboration-status">
                  <div className="collaboration-indicator" />
                  <span className="text-sm font-medium">
                    {collaborationActive ? '3 people editing' : 'Collaboration available'}
                  </span>
                </div>
                <div className="collaboration-users">
                  <div className="collaboration-user active">JD</div>
                  <div className="collaboration-user">SM</div>
                  <div className="collaboration-user">AL</div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setCollaborationActive(!collaborationActive)}
                >
                  {collaborationActive ? 'Leave' : 'Join'} Collaboration
                </button>
              </div>
              
              <div className="p-6 bg-background border border-border rounded-lg">
                <div className="prose max-w-none">
                  <h4 className="text-heading-md mb-4">Conflict Resolution Document</h4>
                  <p className="text-body-md mb-4">
                    This document outlines the mediation process for resolving workplace conflicts...
                  </p>
                  <p className="text-body-md mb-4">
                    The process involves three main stages: initial assessment, mediation session, and follow-up...
                  </p>
                </div>
              </div>

              {collaborationActive && (
                <div className="comments-container">
                  <div className="comment-item">
                    <div className="comment-avatar">JD</div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">John Doe</span>
                        <span className="comment-timestamp">2 minutes ago</span>
                      </div>
                      <div className="comment-text">
                        Should we add a section about conflict prevention strategies?
                      </div>
                      <div className="comment-actions">
                        <button className="comment-action">Reply</button>
                        <button className="comment-action">Resolve</button>
                      </div>
                    </div>
                  </div>

                  <div className="comment-item">
                    <div className="comment-avatar">SM</div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">Sarah Miller</span>
                        <span className="comment-timestamp">1 minute ago</span>
                      </div>
                      <div className="comment-text">
                        Great idea! That would make this more comprehensive.
                      </div>
                      <div className="comment-actions">
                        <button className="comment-action">Reply</button>
                        <button className="comment-action">Resolve</button>
                      </div>
                    </div>
                  </div>

                  <div className="comment-form">
                    <textarea 
                      className="comment-input"
                      placeholder="Add a comment..."
                    />
                    <button className="comment-submit">Post Comment</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Defaults Demo */}
        <div className="mb-12">
          <h3 className="text-heading-lg mb-6">Smart Defaults & AI Suggestions</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="smart-suggestion">
              <div className="smart-suggestion-header">
                <div className="smart-suggestion-icon">🤖</div>
                <span className="smart-suggestion-title">AI Suggestion</span>
              </div>
              <div className="smart-suggestion-text">
                Based on your previous conflict resolution cases, we recommend adding 
                "Communication Breakdown" as a primary category for this project.
              </div>
              <div className="smart-suggestion-actions">
                <button className="smart-suggestion-btn">Dismiss</button>
                <button className="smart-suggestion-btn primary">Apply Suggestion</button>
              </div>
            </div>

            <div className="smart-suggestion">
              <div className="smart-suggestion-header">
                <div className="smart-suggestion-icon">📊</div>
                <span className="smart-suggestion-title">Pattern Recognition</span>
              </div>
              <div className="smart-suggestion-text">
                You typically schedule follow-up sessions 2 weeks after initial mediation. 
                Would you like to set this as the default interval?
              </div>
              <div className="smart-suggestion-actions">
                <button className="smart-suggestion-btn">No, thanks</button>
                <button className="smart-suggestion-btn primary">Set as Default</button>
              </div>
            </div>
          </div>
        </div>

        {/* Future-Ready Architecture Demo */}
        <div className="mb-12">
          <h3 className="text-heading-lg mb-6">Future-Ready Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="component-registry card-premium-elevated p-6">
              <div className="component-registry-indicator">v2.1</div>
              <div className="component-health" />
              <div className="component-version">v2.1.0</div>
              <div className="component-metrics">Metrics</div>
              
              <h4 className="text-heading-md mb-3">Smart Form Component</h4>
              <p className="text-body-md text-muted-foreground mb-4">
                Advanced form component with AI-powered suggestions and real-time validation.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                  React 18+
                </span>
                <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded">
                  TypeScript
                </span>
              </div>
            </div>

            <div className="component-registry card-premium-elevated p-6">
              <div className="component-registry-indicator">v1.9</div>
              <div className="component-health warning" />
              <div className="component-version">v1.9.2</div>
              <div className="component-metrics">Metrics</div>
              
              <h4 className="text-heading-md mb-3">Notification System</h4>
              <p className="text-body-md text-muted-foreground mb-4">
                Priority-based notification system with smart grouping and auto-dismissal.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                  React 18+
                </span>
                <span className="px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded">
                  Update Available
                </span>
              </div>
            </div>

            <div className="component-registry card-premium-elevated p-6">
              <div className="component-registry-indicator">v3.0</div>
              <div className="component-health error" />
              <div className="component-version">v3.0.0-beta</div>
              <div className="component-metrics">Metrics</div>
              
              <h4 className="text-heading-md mb-3">Collaboration Engine</h4>
              <p className="text-body-md text-muted-foreground mb-4">
                Real-time collaboration system with conflict resolution and version control.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                  React 18+
                </span>
                <span className="px-2 py-1 bg-error-100 text-error-700 text-xs rounded">
                  Beta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="card-premium-elevated p-8 max-w-2xl mx-auto">
            <h3 className="text-heading-lg mb-4">Ready to Experience the Future?</h3>
            <p className="text-body-md text-muted-foreground mb-6">
              These cutting-edge features are just the beginning. Our platform continuously 
              evolves with the latest technologies and user experience innovations.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary btn-lg">
                Start Building
              </button>
              <button className="btn btn-secondary btn-lg">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close shortcuts overlay when clicking outside */}
      {showShortcuts && (
        <div 
          className="keyboard-shortcuts-overlay active"
          onClick={() => setShowShortcuts(false)}
        />
      )}
    </div>
  );
};

export default CuttingEdgeFeaturesShowcase;