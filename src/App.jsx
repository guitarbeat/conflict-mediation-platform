import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Users, Heart, MessageCircle, Target, Handshake, FileText, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import EmojiGridMapper from './components/EmojiGridMapper';
import SectionSeparator from './components/SectionSeparator';
import DarkModeToggle from './components/DarkModeToggle';
import GuidanceAlert from './components/GuidanceAlert';
import ParticleBackground from './components/ParticleBackground';
import { generateEnhancedPDF } from './utils/pdfGenerator';
import logo from './assets/logo.png';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    partyAName: '',
    partyBName: '',
    dateOfIncident: '',
    dateOfMediation: '',
    locationOfConflict: '',
    conflictDescription: '',
    // Individual Reflection A
    partyAThoughts: '',
    partyASelectedEmotionWords: [],
    partyAEmotionChartPosition: null,
    partyAAggressiveApproach: '',
    partyAPassiveApproach: '',
    partyAAssertiveApproach: '',
    partyAWhyBecause: '',
    // Individual Reflection B
    partyBThoughts: '',
    partyBSelectedEmotionWords: [],
    partyBEmotionChartPosition: null,
    partyBAggressiveApproach: '',
    partyBPassiveApproach: '',
    partyBAssertiveApproach: '',
    partyBWhyBecause: '',
    // ABCDE Model
    activatingEvent: '',
    partyABeliefs: '',
    partyBBeliefs: '',
    partyAConsequences: '',
    partyBConsequences: '',
    partyADisputations: '',
    partyBDisputations: '',
    effectsReflections: '',
    // Solution Development
    partyAMiracle: '',
    partyBMiracle: '',
    partyATop3Solutions: '',
    partyBTop3Solutions: '',
    partyAPerspective: '',
    partyBPerspective: '',
    compromiseSolutions: '',
    // Agreement & Action Steps
    partyAUnmetNeeds: '',
    partyBUnmetNeeds: '',
    partyANeedsInPractice: '',
    partyBNeedsInPractice: '',
    actionSteps: '',
    followUpDate: '',
    additionalSupport: ''
  });

  const totalSteps = 6;
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setIsAnimating(true);
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
        setSlideDirection('');
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true);
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
        setSlideDirection('');
      }, 300);
    }
  };

  // Enhanced swipe functionality with animations
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setDragOffset(0);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    
    // Calculate drag offset and rotation for Tinder-style effect
    const offset = currentTouch - touchStart;
    const maxOffset = 200; // Increased for more dramatic effect
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, offset));
    
    // Calculate rotation based on drag distance (max 15 degrees)
    const rotation = (clampedOffset / maxOffset) * 15;
    
    setDragOffset(clampedOffset);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < totalSteps) {
      setIsAnimating(true);
      setSlideDirection('left');
      setTimeout(() => {
        nextStep();
        setIsAnimating(false);
        setSlideDirection('');
        setDragOffset(0);
      }, 300);
    } else if (isRightSwipe && currentStep > 1) {
      setIsAnimating(true);
      setSlideDirection('right');
      setTimeout(() => {
        prevStep();
        setIsAnimating(false);
        setSlideDirection('');
        setDragOffset(0);
      }, 300);
    } else {
      // Snap back if swipe wasn't far enough
      setDragOffset(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && currentStep > 1) {
        prevStep();
      }
      if (e.key === 'ArrowRight' && currentStep < totalSteps) {
        nextStep();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, totalSteps]);

  const exportToJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `conflict-mediation-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToPDF = () => {
    generateEnhancedPDF(formData);
  };

  const STEPS = [
    'Setup',
    'Individual Reflection - Party A',
    'Individual Reflection - Party B', 
    'Shared Discussion (ABCDE)',
    'Solution Development',
    'Agreement & Action Steps'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert step={currentStep} partyAName={formData.partyAName} partyBName={formData.partyBName} />
            
            <SectionSeparator title="Party Information" icon="👥" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Let's start by gathering some basic information about the conflict and the parties involved.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="partyAName">Party A Name</Label>
                <Input
                  id="partyAName"
                  placeholder="Enter first person's name"
                  value={formData.partyAName}
                  onChange={(e) => updateFormData('partyAName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partyBName">Party B Name</Label>
                <Input
                  id="partyBName"
                  placeholder="Enter second person's name"
                  value={formData.partyBName}
                  onChange={(e) => updateFormData('partyBName', e.target.value)}
                />
              </div>
            </div>

            <SectionSeparator title="Conflict Details" icon="📋" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfIncident">Date of Incident</Label>
                <Input
                  id="dateOfIncident"
                  type="date"
                  value={formData.dateOfIncident}
                  onChange={(e) => updateFormData('dateOfIncident', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfMediation">Date of Mediation</Label>
                <Input
                  id="dateOfMediation"
                  type="date"
                  value={formData.dateOfMediation}
                  onChange={(e) => updateFormData('dateOfMediation', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationOfConflict">Location of Conflict</Label>
                <Input
                  id="locationOfConflict"
                  placeholder="Where did this happen?"
                  value={formData.locationOfConflict}
                  onChange={(e) => updateFormData('locationOfConflict', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conflictDescription">Agreed Upon Description of Conflict</Label>
              <Textarea
                id="conflictDescription"
                placeholder="Both parties should agree on this description of what happened..."
                value={formData.conflictDescription}
                onChange={(e) => updateFormData('conflictDescription', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert step={currentStep} partyAName={formData.partyAName} partyBName={formData.partyBName} />
            
            <SectionSeparator title="Thoughts & Beliefs" icon="🤔" />
            <div className="space-y-3 sm:space-y-4">
              <Label htmlFor="partyAThoughts">I think...</Label>
              <Textarea
                id="partyAThoughts"
                placeholder="Explain what you think or believe to be true about the conflict..."
                value={formData.partyAThoughts}
                onChange={(e) => updateFormData('partyAThoughts', e.target.value)}
                rows={4}
              />
            </div>

            <SectionSeparator title="Emotions & Feelings" icon="💚" />
            <div className="space-y-3 sm:space-y-4">
              <Label>I feel... (Use both methods to express your emotions)</Label>
              <EmojiGridMapper
                onEmotionWordsChange={(words) => updateFormData('partyASelectedEmotionWords', words)}
                onChartPositionChange={(position) => updateFormData('partyAEmotionChartPosition', position)}
                selectedEmotionWords={formData.partyASelectedEmotionWords}
                chartPosition={formData.partyAEmotionChartPosition}
              />
            </div>

            <SectionSeparator title="Communication Approaches" icon="💬" />
            <div className="space-y-4 sm:space-y-6">
              <Label>I want... (Communication Approaches)</Label>
              
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyAAggressiveApproach" className="text-red-600">Aggressive Approach (Not Recommended)</Label>
                <Textarea
                  id="partyAAggressiveApproach"
                  placeholder="What would you want to say if you were being aggressive?"
                  value={formData.partyAAggressiveApproach}
                  onChange={(e) => updateFormData('partyAAggressiveApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyAPassiveApproach" className="text-blue-600">Passive Approach</Label>
                <Textarea
                  id="partyAPassiveApproach"
                  placeholder="What would you want if you were being passive?"
                  value={formData.partyAPassiveApproach}
                  onChange={(e) => updateFormData('partyAPassiveApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyAAssertiveApproach" className="text-green-600">Assertive Approach (Recommended)</Label>
                <Textarea
                  id="partyAAssertiveApproach"
                  placeholder="What would you want to say if you were being assertive and respectful?"
                  value={formData.partyAAssertiveApproach}
                  onChange={(e) => updateFormData('partyAAssertiveApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyAWhyBecause">Why/Because...</Label>
                <Textarea
                  id="partyAWhyBecause"
                  placeholder="Explain your reasoning..."
                  value={formData.partyAWhyBecause}
                  onChange={(e) => updateFormData('partyAWhyBecause', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert step={currentStep} partyAName={formData.partyAName} partyBName={formData.partyBName} />
            
            <SectionSeparator title="Thoughts & Beliefs" icon="🤔" />
            <div className="space-y-3 sm:space-y-4">
              <Label htmlFor="partyBThoughts">I think...</Label>
              <Textarea
                id="partyBThoughts"
                placeholder="Explain what you think or believe to be true about the conflict..."
                value={formData.partyBThoughts}
                onChange={(e) => updateFormData('partyBThoughts', e.target.value)}
                rows={4}
              />
            </div>

            <SectionSeparator title="Emotions & Feelings" icon="💚" />
            <div className="space-y-3 sm:space-y-4">
              <Label>I feel... (Use both methods to express your emotions)</Label>
              <EmojiGridMapper
                onEmotionWordsChange={(words) => updateFormData('partyBSelectedEmotionWords', words)}
                onChartPositionChange={(position) => updateFormData('partyBEmotionChartPosition', position)}
                selectedEmotionWords={formData.partyBSelectedEmotionWords}
                chartPosition={formData.partyBEmotionChartPosition}
              />
            </div>

            <SectionSeparator title="Communication Approaches" icon="💬" />
            <div className="space-y-4 sm:space-y-6">
              <Label>I want... (Communication Approaches)</Label>
              
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyBAggressiveApproach" className="text-red-600">Aggressive Approach (Not Recommended)</Label>
                <Textarea
                  id="partyBAggressiveApproach"
                  placeholder="What would you want to say if you were being aggressive?"
                  value={formData.partyBAggressiveApproach}
                  onChange={(e) => updateFormData('partyBAggressiveApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyBPassiveApproach" className="text-blue-600">Passive Approach</Label>
                <Textarea
                  id="partyBPassiveApproach"
                  placeholder="What would you want if you were being passive?"
                  value={formData.partyBPassiveApproach}
                  onChange={(e) => updateFormData('partyBPassiveApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyBAssertiveApproach" className="text-green-600">Assertive Approach (Recommended)</Label>
                <Textarea
                  id="partyBAssertiveApproach"
                  placeholder="What would you want to say if you were being assertive and respectful?"
                  value={formData.partyBAssertiveApproach}
                  onChange={(e) => updateFormData('partyBAssertiveApproach', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="partyBWhyBecause">Why/Because...</Label>
                <Textarea
                  id="partyBWhyBecause"
                  placeholder="Explain your reasoning..."
                  value={formData.partyBWhyBecause}
                  onChange={(e) => updateFormData('partyBWhyBecause', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert step={currentStep} partyAName={formData.partyAName} partyBName={formData.partyBName} />
            
            <SectionSeparator title="ABCDE Model Discussion" icon="🗣️" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Work through this cognitive behavioral model together to understand the conflict better.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="activatingEvent" className="text-base font-semibold">A - Activating Event</Label>
                <p className="text-sm text-muted-foreground">What actually happened? Stick to observable facts.</p>
                <Textarea
                  id="activatingEvent"
                  placeholder="Describe the factual events that triggered this conflict..."
                  value={formData.activatingEvent}
                  onChange={(e) => updateFormData('activatingEvent', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyABeliefs" className="text-base font-semibold">B - {formData.partyAName || 'Party A'} Beliefs</Label>
                  <p className="text-sm text-muted-foreground">What thoughts or beliefs do you have about this event?</p>
                  <Textarea
                    id="partyABeliefs"
                    placeholder="Your thoughts and beliefs about what happened..."
                    value={formData.partyABeliefs}
                    onChange={(e) => updateFormData('partyABeliefs', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBBeliefs" className="text-base font-semibold">B - {formData.partyBName || 'Party B'} Beliefs</Label>
                  <p className="text-sm text-muted-foreground">What thoughts or beliefs do you have about this event?</p>
                  <Textarea
                    id="partyBBeliefs"
                    placeholder="Your thoughts and beliefs about what happened..."
                    value={formData.partyBBeliefs}
                    onChange={(e) => updateFormData('partyBBeliefs', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyAConsequences" className="text-base font-semibold">C - {formData.partyAName || 'Party A'} Consequences</Label>
                  <p className="text-sm text-muted-foreground">How did your beliefs make you feel and behave?</p>
                  <Textarea
                    id="partyAConsequences"
                    placeholder="Your emotional and behavioral responses..."
                    value={formData.partyAConsequences}
                    onChange={(e) => updateFormData('partyAConsequences', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBConsequences" className="text-base font-semibold">C - {formData.partyBName || 'Party B'} Consequences</Label>
                  <p className="text-sm text-muted-foreground">How did your beliefs make you feel and behave?</p>
                  <Textarea
                    id="partyBConsequences"
                    placeholder="Your emotional and behavioral responses..."
                    value={formData.partyBConsequences}
                    onChange={(e) => updateFormData('partyBConsequences', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyADisputations" className="text-base font-semibold">D - {formData.partyAName || 'Party A'} Disputations</Label>
                  <p className="text-sm text-muted-foreground">Challenge your beliefs. Are they helpful? Accurate? Realistic?</p>
                  <Textarea
                    id="partyADisputations"
                    placeholder="Question and challenge your initial beliefs..."
                    value={formData.partyADisputations}
                    onChange={(e) => updateFormData('partyADisputations', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBDisputations" className="text-base font-semibold">D - {formData.partyBName || 'Party B'} Disputations</Label>
                  <p className="text-sm text-muted-foreground">Challenge your beliefs. Are they helpful? Accurate? Realistic?</p>
                  <Textarea
                    id="partyBDisputations"
                    placeholder="Question and challenge your initial beliefs..."
                    value={formData.partyBDisputations}
                    onChange={(e) => updateFormData('partyBDisputations', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="effectsReflections" className="text-base font-semibold">E - Effects & Reflections</Label>
                <p className="text-sm text-muted-foreground">What new insights have emerged? How do you both feel now?</p>
                <Textarea
                  id="effectsReflections"
                  placeholder="Reflect on new perspectives and feelings that have emerged..."
                  value={formData.effectsReflections}
                  onChange={(e) => updateFormData('effectsReflections', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert step={currentStep} partyAName={formData.partyAName} partyBName={formData.partyBName} />
            
            <SectionSeparator title="Solution Development" icon="💡" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Now let's explore possibilities and develop solutions together.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyAMiracle" className="text-base font-semibold">{formData.partyAName || 'Party A'} - Miracle Question</Label>
                  <p className="text-sm text-muted-foreground">If you woke up tomorrow and this conflict was completely resolved, what would be different?</p>
                  <Textarea
                    id="partyAMiracle"
                    placeholder="Describe your ideal resolution..."
                    value={formData.partyAMiracle}
                    onChange={(e) => updateFormData('partyAMiracle', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBMiracle" className="text-base font-semibold">{formData.partyBName || 'Party B'} - Miracle Question</Label>
                  <p className="text-sm text-muted-foreground">If you woke up tomorrow and this conflict was completely resolved, what would be different?</p>
                  <Textarea
                    id="partyBMiracle"
                    placeholder="Describe your ideal resolution..."
                    value={formData.partyBMiracle}
                    onChange={(e) => updateFormData('partyBMiracle', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyATop3Solutions" className="text-base font-semibold">{formData.partyAName || 'Party A'} - Top 3 Solutions</Label>
                  <Textarea
                    id="partyATop3Solutions"
                    placeholder="List your top 3 preferred solutions..."
                    value={formData.partyATop3Solutions}
                    onChange={(e) => updateFormData('partyATop3Solutions', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBTop3Solutions" className="text-base font-semibold">{formData.partyBName || 'Party B'} - Top 3 Solutions</Label>
                  <Textarea
                    id="partyBTop3Solutions"
                    placeholder="List your top 3 preferred solutions..."
                    value={formData.partyBTop3Solutions}
                    onChange={(e) => updateFormData('partyBTop3Solutions', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <SectionSeparator title="Understanding Each Other" icon="🤝" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyAPerspective" className="text-base font-semibold">{formData.partyAName || 'Party A'} - Other's Perspective</Label>
                  <p className="text-sm text-muted-foreground">Try to understand the other person's point of view.</p>
                  <Textarea
                    id="partyAPerspective"
                    placeholder="What might the other person be thinking or feeling?"
                    value={formData.partyAPerspective}
                    onChange={(e) => updateFormData('partyAPerspective', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBPerspective" className="text-base font-semibold">{formData.partyBName || 'Party B'} - Other's Perspective</Label>
                  <p className="text-sm text-muted-foreground">Try to understand the other person's point of view.</p>
                  <Textarea
                    id="partyBPerspective"
                    placeholder="What might the other person be thinking or feeling?"
                    value={formData.partyBPerspective}
                    onChange={(e) => updateFormData('partyBPerspective', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="compromiseSolutions" className="text-base font-semibold">Compromise Solutions</Label>
                <p className="text-sm text-muted-foreground">What solutions can you both agree on? What compromises are you willing to make?</p>
                <Textarea
                  id="compromiseSolutions"
                  placeholder="Describe the solutions you both can accept..."
                  value={formData.compromiseSolutions}
                  onChange={(e) => updateFormData('compromiseSolutions', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            <GuidanceAlert step={currentStep} partyAName={formData.partyAName} partyBName={formData.partyBName} />
            
            <SectionSeparator title="Agreement & Action Steps" icon="✅" />
            <p className="text-center text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Finalize your agreement and create actionable next steps.
            </p>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyAUnmetNeeds" className="text-base font-semibold">{formData.partyAName || 'Party A'} - Unmet Needs</Label>
                  <p className="text-sm text-muted-foreground">What needs of yours weren't being met in this situation?</p>
                  <Textarea
                    id="partyAUnmetNeeds"
                    placeholder="Describe your unmet needs..."
                    value={formData.partyAUnmetNeeds}
                    onChange={(e) => updateFormData('partyAUnmetNeeds', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBUnmetNeeds" className="text-base font-semibold">{formData.partyBName || 'Party B'} - Unmet Needs</Label>
                  <p className="text-sm text-muted-foreground">What needs of yours weren't being met in this situation?</p>
                  <Textarea
                    id="partyBUnmetNeeds"
                    placeholder="Describe your unmet needs..."
                    value={formData.partyBUnmetNeeds}
                    onChange={(e) => updateFormData('partyBUnmetNeeds', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyANeedsInPractice" className="text-base font-semibold">{formData.partyAName || 'Party A'} - Needs in Practice</Label>
                  <p className="text-sm text-muted-foreground">How can these needs be met going forward?</p>
                  <Textarea
                    id="partyANeedsInPractice"
                    placeholder="Practical ways to meet your needs..."
                    value={formData.partyANeedsInPractice}
                    onChange={(e) => updateFormData('partyANeedsInPractice', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="partyBNeedsInPractice" className="text-base font-semibold">{formData.partyBName || 'Party B'} - Needs in Practice</Label>
                  <p className="text-sm text-muted-foreground">How can these needs be met going forward?</p>
                  <Textarea
                    id="partyBNeedsInPractice"
                    placeholder="Practical ways to meet your needs..."
                    value={formData.partyBNeedsInPractice}
                    onChange={(e) => updateFormData('partyBNeedsInPractice', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="actionSteps" className="text-base font-semibold">Specific Action Steps</Label>
                <p className="text-sm text-muted-foreground">What specific actions will each person take? Include deadlines and accountability measures.</p>
                <Textarea
                  id="actionSteps"
                  placeholder="List specific, measurable action steps with deadlines..."
                  value={formData.actionSteps}
                  onChange={(e) => updateFormData('actionSteps', e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="followUpDate" className="text-base font-semibold">Follow-up Date</Label>
                  <p className="text-sm text-muted-foreground">When should you check in on progress?</p>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => updateFormData('followUpDate', e.target.value)}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label htmlFor="additionalSupport" className="text-base font-semibold">Additional Support Needed</Label>
                  <p className="text-sm text-muted-foreground">What additional resources or support might be helpful?</p>
                  <Textarea
                    id="additionalSupport"
                    placeholder="Describe any additional support needed..."
                    value={formData.additionalSupport}
                    onChange={(e) => updateFormData('additionalSupport', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                <SectionSeparator title="Export Your Session" icon="📄" />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={exportToJSON}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button
                    onClick={exportToPDF}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Export as PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <DarkModeToggle />
      
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-4 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            <img src={logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12" />
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Co-op Conflict Resolution Platform</h1>
              <p className="text-primary-foreground/80 mt-1 sm:mt-2 text-sm sm:text-base">
                A structured approach to resolving interpersonal conflicts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <div className="mb-4 sm:mb-8">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium">Step {currentStep} of {totalSteps}: {STEPS[currentStep - 1]}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">{progressPercentage}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between mt-2 sm:mt-4">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  index + 1 < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index + 1 === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <Card 
          className="mb-4 sm:mb-8 transition-all duration-300 ease-out"
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg) ${
              isAnimating 
                ? slideDirection === 'left' 
                  ? 'translateX(-100%) rotate(-10deg)' 
                  : 'translateX(100%) rotate(10deg)'
                : 'translateX(0) rotate(0deg)'
            }`,
            opacity: isAnimating ? 0 : 1,
            transformOrigin: 'center bottom',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Fixed Navigation Buttons - Hidden on mobile */}
        <Button
          onClick={prevStep}
          disabled={currentStep === 1}
          variant="outline"
          className="hidden md:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-50 items-center gap-2 px-4 py-3 shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden lg:inline">Previous</span>
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          className="hidden md:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-50 items-center gap-2 px-4 py-3 shadow-lg"
        >
          <span className="hidden lg:inline">Next</span>
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Step indicator at bottom */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );
}

export default App;