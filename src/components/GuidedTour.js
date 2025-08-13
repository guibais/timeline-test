import React, { useState, useEffect } from 'react';

const GuidedTour = ({ isActive, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps = [
    {
      target: '.app-header',
      title: '🎉 Welcome to Timeline Visualization!',
      content: 'This interactive timeline helps you organize and visualize events across time. Perfect for project planning, historical events, or any time-based data. Let\'s explore together!',
      position: 'bottom',
      icon: '🎯'
    },
    {
      target: '.timeline-controls',
      title: '🔍 Zoom Controls',
      content: 'Use these buttons to zoom in for detailed views or zoom out for the big picture. The zoom level shows your current magnification.',
      position: 'bottom',
      icon: '⚡'
    },
    {
      target: '.timeline-header',
      title: '📅 Smart Timeline Header',
      content: 'This intelligent header shows dates with automatic intervals. Major dates (like month starts) are highlighted. The spacing adapts to your zoom level.',
      position: 'bottom',
      icon: '🗓️'
    },
    {
      target: '.lane-label',
      title: '🎨 Color-Coded Lanes',
      content: 'Each lane represents a different category or theme. Items in the same lane share beautiful gradient colors for easy visual grouping.',
      position: 'right',
      icon: '🌈'
    },
    {
      target: '.timeline-item:first-child',
      title: '📦 Interactive Timeline Items',
      content: 'These are your events! Each shows its name, duration, and dates. They\'re fully interactive - try clicking and dragging them around.',
      position: 'top',
      icon: '✨'
    },
    {
      target: '.timeline-item:first-child',
      title: '🚀 Drag & Drop Magic',
      content: 'Drag items horizontally to change dates, or vertically to move between color lanes. Works on both desktop and mobile!',
      position: 'top',
      icon: '🎯'
    },
    {
      target: '.timeline-item:first-child',
      title: '📏 Resize with Handles',
      content: 'Hover over items to reveal resize handles on the edges. Drag these to extend or shorten event durations.',
      position: 'top',
      icon: '🔧'
    },
    {
      target: '.timeline-item:first-child .item-name',
      title: '✏️ Quick Name Editing',
      content: 'Double-click any item name to edit it inline. Press Enter to save or Escape to cancel. Perfect for quick updates!',
      position: 'top',
      icon: '📝'
    },
    {
      target: '.tour-trigger',
      title: '🎓 You\'re All Set!',
      content: 'Congratulations! You now know all the features. Click the tour button anytime to review these tips. Happy timeline building!',
      position: 'bottom',
      icon: '🏆'
    }
  ];

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isActive]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    setIsVisible(false);
    localStorage.setItem('timeline-tour-completed', 'true');
    onComplete();
  };

  const getTooltipPosition = (step) => {
    const target = document.querySelector(step.target);
    if (!target) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = target.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const margin = 20;

    let position = step.position;
    
    // Auto-adjust position for mobile/small screens
    if (viewport.width < 768) {
      if (rect.top < tooltipHeight + margin) {
        position = 'bottom';
      } else if (rect.bottom > viewport.height - tooltipHeight - margin) {
        position = 'top';
      }
    }

    const positionMap = {
      top: {
        top: Math.max(margin, rect.top - 15),
        left: Math.min(Math.max(margin, rect.left + rect.width / 2), viewport.width - tooltipWidth - margin),
        transform: 'translate(-50%, -100%)'
      },
      bottom: {
        top: Math.min(rect.bottom + 15, viewport.height - tooltipHeight - margin),
        left: Math.min(Math.max(margin, rect.left + rect.width / 2), viewport.width - tooltipWidth - margin),
        transform: 'translate(-50%, 0)'
      },
      left: {
        top: Math.min(Math.max(margin, rect.top + rect.height / 2), viewport.height - tooltipHeight - margin),
        left: Math.max(margin, rect.left - 15),
        transform: 'translate(-100%, -50%)'
      },
      right: {
        top: Math.min(Math.max(margin, rect.top + rect.height / 2), viewport.height - tooltipHeight - margin),
        left: Math.min(rect.right + 15, viewport.width - tooltipWidth - margin),
        transform: 'translate(0, -50%)'
      }
    };

    return positionMap[position] || positionMap.bottom;
  };

  const highlightTarget = (step) => {
    const target = document.querySelector(step.target);
    if (target) {
      target.classList.add('tour-highlight');
      return () => target.classList.remove('tour-highlight');
    }
  };

  useEffect(() => {
    if (isVisible && tourSteps[currentStep]) {
      const cleanup = highlightTarget(tourSteps[currentStep]);
      return cleanup;
    }
  }, [currentStep, isVisible]);

  if (!isVisible || !tourSteps[currentStep]) return null;

  const currentStepData = tourSteps[currentStep];
  const position = getTooltipPosition(currentStepData);

  return (
    <>
      <div className="tour-overlay" />
      <div 
        className="tour-tooltip"
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform: position.transform,
          zIndex: 10001
        }}
      >
        <div className="tour-content">
          <div className="tour-header">
            <div className="tour-title-wrapper">
              <span className="tour-icon">{currentStepData.icon}</span>
              <h3>{currentStepData.title}</h3>
            </div>
            <button className="tour-close" onClick={skipTour} aria-label="Close tour">×</button>
          </div>
          <p>{currentStepData.content}</p>
          <div className="tour-footer">
            <div className="tour-progress">
              <div className="tour-progress-bar">
                <div 
                  className="tour-progress-fill" 
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
              <span className="tour-progress-text">
                {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
            <div className="tour-buttons">
              {currentStep > 0 && (
                <button className="tour-btn tour-btn-secondary" onClick={prevStep}>
                  ← Previous
                </button>
              )}
              <button className="tour-btn tour-btn-primary" onClick={nextStep}>
                {currentStep === tourSteps.length - 1 ? '🎉 Finish' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
        <div className={`tour-arrow tour-arrow-${currentStepData.position}`} />
      </div>
    </>
  );
};

export default GuidedTour;
