import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.brand': 'AXONOVA',
    'nav.subtitle': 'Brain MRI Deep Learning Platform',
    'nav.home': 'Home / Overview',
    'nav.scan_center': 'Scan Center',
    'nav.evaluation': 'Model Evaluation',
    'nav.dataset': 'Dataset Explorer',
    'nav.how_it_works': 'How It Works',
    'nav.about': 'About AXONOVA',
    'nav.settings': 'Settings',

    // Common
    'common.educational_badge': 'Educational Prototype',
    'common.research_only': 'Research & Demonstration Only',
    'common.model_status': 'Model Status',
    'common.loaded': 'Loaded & Ready',
    'common.not_loaded': 'Model Not Loaded',
    'common.analyze': 'Analyze Selected Scan',
    'common.analyzing': 'Processing Neural Network...',
    'common.clear': 'Clear All',
    'common.remove': 'Remove',
    'common.zoom_in': 'Zoom In',
    'common.zoom_out': 'Zoom Out',
    'common.reset': 'Reset View',
    'common.rotate': 'Rotate 90°',
    'common.disclaimer_title': 'Important Medical Safety Notice',
    'common.disclaimer_body': 'AXONOVA is a research and educational AI prototype. Its outputs are intended to support learning and research only and must not be considered a definitive medical diagnosis or used as the sole basis for healthcare decisions. Medical scans and AI outputs must be reviewed by qualified healthcare professionals.',

    // Home Page
    'home.hero_title': 'Deep Learning-Based Brain MRI Analysis',
    'home.hero_desc': 'An open, transparent educational platform demonstrating Convolutional Neural Network (CNN) architecture, spatial feature extraction, and held-out evaluation for brain MRI dataset categorization.',
    'home.open_scan_center': 'Open Scan Center',
    'home.view_evaluation': 'View Model Evaluation',
    'home.workflow_title': 'Deep Learning Workflow',
    'home.step1_title': '1. Dataset Validation',
    'home.step1_desc': 'Verifying directory structures, image integrity, and avoiding data leakage.',
    'home.step2_title': '2. Preprocessing Pipeline',
    'home.step2_desc': 'Rescaling to [0,1], bilinear resizing (224×224), and RGB channel unification.',
    'home.step3_title': '3. CNN Model Training',
    'home.step3_desc': 'Learning spatial patterns via Conv2D, BatchNorm, Pooling, and Adam optimization.',
    'home.step4_title': '4. Held-Out Evaluation',
    'home.step4_desc': 'Unbiased benchmarking with Confusion Matrix, Precision, Recall, and F1-score.',

    // Scan Center
    'scan.title': 'MRI Scan Center',
    'scan.desc': 'Upload genuine brain MRI slices in JPEG or PNG format for neural network classification and Grad-CAM feature localization.',
    'scan.select_modality': 'Scan Modality',
    'scan.mri_supported': 'Brain MRI (Active)',
    'scan.ct_disabled': 'CT (Disabled - Future Scope)',
    'scan.xray_disabled': 'X-ray (Disabled - Future Scope)',
    'scan.select_orientation': 'Reported MRI Orientation',
    'scan.dropzone_text': 'Drag and drop MRI scan image here, or browse files',
    'scan.dropzone_subtext': 'Supports standard image formats (JPG, JPEG, PNG) up to 15MB. DICOM is not supported.',
    'scan.gallery_title': 'Uploaded Scan Gallery',
    'scan.selected_badge': 'Selected for Inference',
    'scan.no_image_selected': 'Please select an image from the gallery to preview and analyze.',

    // Results Page
    'results.title': 'Model Prediction Results',
    'results.desc': 'Neural network output category scores and visual explainability overlay.',
    'results.predicted_category': 'Predicted Dataset Category',
    'results.model_score': 'Model Score (Not a Disease Probability)',
    'results.score_note': 'Raw softmax output representing statistical confidence relative to training dataset classes.',
    'results.per_class_scores': 'All Class Output Probabilities',
    'results.gradcam_title': 'Grad-CAM Feature Activation Map',
    'results.gradcam_desc': 'Shows spatial gradient regions in the convolutional layers that most strongly influenced the model prediction.',
    'results.analyze_another': 'Analyze Another Scan',
    'results.back_to_scans': 'Back to Scan Center',

    // Evaluation Page
    'eval.title': 'Model Performance & Evaluation',
    'eval.desc': 'Verified metrics measured on held-out test data. No fabricated scores.',
    'eval.accuracy': 'Overall Accuracy',
    'eval.precision': 'Precision (Macro)',
    'eval.recall': 'Recall (Macro)',
    'eval.f1': 'F1-Score (Macro)',
    'eval.cm_title': 'Held-out Confusion Matrix',
    'eval.curves_title': 'Training & Validation Curves',
    'eval.not_evaluated': 'Model has not been evaluated on test data yet. Run python -m model.evaluate to generate metrics.',

    // Dataset Page
    'dataset.title': 'Dataset Explorer',
    'dataset.desc': 'Real-time structural overview of the local MRI dataset directory and class distribution.',
    'dataset.total_images': 'Total Scans',
    'dataset.class_distribution': 'Class Distribution',
    'dataset.folder_structure': 'Directory Layout',

    // How It Works
    'how.title': 'How Convolutional Neural Networks Work',
    'how.desc': 'An interactive visual guide to CNN layers, mathematical foundations, and medical imaging AI principles.',

    // About
    'about.title': 'About AXONOVA',
    'about.desc': 'Educational mission, clinical safety principles, architectural integrity, and developer information.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language: Language = 'en';

  useEffect(() => {
    // Ensure English is set as single standardized language
    localStorage.setItem('axonova_lang', 'en');
  }, []);

  const setLanguage = (_lang: Language) => {
    // English is the single application language
    localStorage.setItem('axonova_lang', 'en');
  };

  const t = (key: string): string => {
    return translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
