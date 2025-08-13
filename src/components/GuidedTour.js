import React, { useState, useEffect } from 'react';

const GuidedTour = ({ isActive, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps = [
    {
      target: '.app-header',
      title: 'Welcome to Timeline Visualization!',
      content: 'This interactive timeline helps you organize and visualize events across time. Let\'s take a quick tour!',
      position: 'bottom'
    },
    {
      target: '.timeline-controls',
      title: 'Zoom Controls',
      content: 'Use these buttons to zoom in and out of your timeline. Perfect for viewing different time scales.',
      position: 'bottom'
    },
    {
      target: '.timeline-header',
      title: 'Timeline Header',
      content: 'This shows the date range with smart intervals. Dates adjust automatically based on your zoom level.',
      position: 'bottom'
    },
    {
      target: '.lane-label',
      title: 'Color Lanes',
      content: 'Each lane represents a different category. Items in the same lane share the same color theme.',
      position: 'right'
    },
    {
      target: '.timeline-item:first-child',
      title: 'Timeline Items',
      content: 'These are your events! Each item shows its name and duration. Try interacting with them.',
      position: 'top'
    },
    {
      target: '.timeline-item:first-child',
      title: 'Drag to Move',
      content: 'Drag items horizontally to change their dates, or vertically to move them between color lanes.',
      position: 'top'
    },
    {
      target: '.timeline-item:first-child .resize-handle',
      title: 'Resize Items',
      content: 'Hover over items to see resize handles. Drag these to change the duration of events.',
      position: 'top'
    },
    {
      target: '.timeline-item:first-child .item-name',
      title: 'Edit Names',
      content: 'Double-click any item name to edit it inline. Press Enter to save or Escape to cancel.',
      position: 'top'
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
    if (!target) return { top: '50%', left: '50%' };

    const rect = target.getBoundingClientRect();
    const positionMap = {
      top: {
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)'
      },
      bottom: {
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, 0)'
      },
      left: {
        top: rect.top + rect.height / 2,
        left: rect.left - 10,
        transform: 'translate(-100%, -50%)'
      },
      right: {
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
        transform: 'translate(0, -50%)'
      }
    };

    return positionMap[step.position] || positionMap.bottom;
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
            <h3>{currentStepData.title}</h3>
            <button className="tour-close" onClick={skipTour}>×</button>
          </div>
          <p>{currentStepData.content}</p>
          <div className="tour-footer">
            <div className="tour-progress">
              {currentStep + 1} of {tourSteps.length}
            </div>
            <div className="tour-buttons">
              {currentStep > 0 && (
                <button className="tour-btn tour-btn-secondary" onClick={prevStep}>
                  Previous
                </button>
              )}
              <button className="tour-btn tour-btn-primary" onClick={nextStep}>
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
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
