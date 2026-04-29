export const EXTERNAL = {
  intake: 'https://service.prescribery.com/PatientSetUp/?agent=BryanEasterling&role=nci-sales-agent&agent_id=1179',
  portal: 'https://staff.prescribery.com/dashboard',
  founderPay: 'https://buy.stripe.com/4gM5kD8r75gAaGdgAQc3m00',
};

export type QuestionnaireSlug = 'weight' | 'hormone' | 'sexual';

export type QuestionnaireMeta = {
  slug: QuestionnaireSlug;
  title: string;
  category: string;
  blurb: string;
  url: string;
  recommendedFor: string[];
};

export const QUESTIONNAIRES: QuestionnaireMeta[] = [
  {
    slug: 'weight',
    title: 'Weight Loss / GLP Questionnaire',
    category: 'Weight Loss',
    blurb: 'For members exploring GLP-1 protocols, metabolic resets, or body recomp programs.',
    url: 'https://staff.prescribery.com/short/wkMNjld7jeEK',
    recommendedFor: ['Weight Loss / GLP', 'Performance / Recovery', 'Not sure yet'],
  },
  {
    slug: 'hormone',
    title: 'Hormone Optimization / TRT Questionnaire',
    category: 'Hormone Optimization',
    blurb: 'For TRT, female hormone work, peptides, thyroid, and adrenal protocols.',
    url: 'https://staff.prescribery.com/short/QJy4zwZMDejn',
    recommendedFor: ['Hormone Optimization / TRT', 'Performance / Recovery', 'Hair & Skin', 'Not sure yet'],
  },
  {
    slug: 'sexual',
    title: 'Sexual Wellness Questionnaire',
    category: 'Sexual Wellness',
    blurb: 'For ED protocols, libido work, PT-141, and partner-positive plans.',
    url: 'https://staff.prescribery.com/short/JWaV7EPL241G',
    recommendedFor: ['Sexual Wellness', 'Performance / Recovery', 'Not sure yet'],
  },
];

export function recommendedSlugs(goal: string): QuestionnaireSlug[] {
  return QUESTIONNAIRES.filter((q) => q.recommendedFor.includes(goal)).map((q) => q.slug);
}
