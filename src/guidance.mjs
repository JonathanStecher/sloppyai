import path from 'node:path';
import { SEVERITIES, SKILL_ROOT } from './assets.mjs';

const referenceFor = {
  accessibility: 'accessibility.md',
  ux: 'ux.md',
  copy: 'copy.md',
  performance: 'performance.md',
  security: 'security.md',
  engineering: 'engineering.md',
  design: 'design.md',
  media: 'media.md',
  rights: 'media.md',
  devex: 'engineering.md'
};

const visualQualityRuleIds = ['D24', 'D25', 'D26', 'D27', 'D28', 'D29', 'D30', 'D31'];

export function improvementGuidance(result) {
  const { report, config, catalog, patches, confirmedReviewFindings } = result;
  const reference = filename => path.join(SKILL_ROOT, 'references', filename);
  const builtInFindings = new Set(patches.map(patch => patch.findingId));
  const findings = report.findings.filter(item => item.disposition === 'open').sort((a, b) =>
    SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) ||
    Number(b.confidence === 'supported') - Number(a.confidence === 'supported'));
  const steps = findings.map(finding => ({
    findingId: finding.id,
    ruleId: finding.ruleId,
    method: builtInFindings.has(finding.id) ? 'built_in' : 'contextual',
    reviewerConfirmed: confirmedReviewFindings.has(finding.id),
    verification: catalog.byId.get(finding.ruleId)?.verification || []
  }));
  return {
    checklistFile: reference('release-review.md'),
    checklistTemplateFile: path.join(SKILL_ROOT, 'checklists', 'release.json'),
    repairGuideFile: reference('repairs.md'),
    rubricFile: reference('ratings.md'),
    reviewSchemaFile: path.join(SKILL_ROOT, 'schemas', 'review.schema.json'),
    domains: config.domains,
    domainReferences: Object.fromEntries(config.domains.map(domain => [domain, reference(referenceFor[domain])])),
    ...(config.domains.includes('design') ? {
      designReview: {
        guideFile: reference('visual-quality.md'),
        brief: config.designBrief ?? {},
        referencePolicy: {
          use: config.designBrief?.referenceUse ?? 'quality',
          explicit: config.designBrief?.referenceUse !== undefined,
          references: config.designBrief?.references ?? [],
          instruction: config.designBrief?.referenceUse === 'style'
            ? 'Apply only the requested visual direction while preserving the product, content and useful behavior. A style reference is not permission to copy unrelated product flows or assets.'
            : 'Use references to assess execution quality. Derive the visual direction from this product; do not transfer a reference palette, font, layout or signature interaction merely to match its quality.'
        },
        qualityWorkflow: {
          guideFile: reference('quality-benchmarks.md'),
          decisionGuideFile: reference('design-decisions.md'),
          identityGuideFile: reference('product-identity.md'),
          identityResetGuideFile: reference('identity-reset.md'),
          landingPageGuideFile: reference('landing-pages.md'),
          status: 'not_assessed',
          evidence: [],
          checks: [
            { id: 'reference_intent', question: 'What is the reference being used to assess, and what current evidence supports that comparison?' },
            { id: 'product_direction', question: 'Which visual decisions follow from this audience, task, content and accepted identity?' },
            { id: 'surface_purpose_and_story', question: 'Is this an operating screen, a product landing page or a mixture? For a landing page, how do the offer, focal visual, reading progression and useful demonstration help a new visitor understand and choose the actual product, without inventing proof or replacing an accepted direct-to-tool experience?' },
            { id: 'identity_acceptance', question: 'Which identity choices did the user accept, which were only generated defaults, and which have been rejected?' },
            { id: 'decoration_purpose', question: 'What do the actual overlines, type emphasis, palette, button treatments and icons contribute to this task, and which combined choices caused the rejection?' },
            { id: 'different_assumption', question: 'If the look was rejected, which materially different approach was compared with the same content and required behavior?' },
            { id: 'reference_relationships', question: 'Which relationships were observed in actual product websites, what principle transfers, and what identity or assets must remain with those references?' },
            { id: 'positive_identity', question: 'What positive identity follows from this product, and how do content, type, colour, imagery and interaction reinforce it beyond the removal of generic decoration?' },
            { id: 'composition_baseline', question: 'When the layout was rejected, what reading order, content priority, image role and repeated spatial relationships caused that response?' },
            { id: 'alternative_independence', question: 'Do matched desktop and phone renders, including a grayscale comparison and useful lower section, show a different reading experience rather than two treatments of the rejected model?' },
            { id: 'type_and_control_language', question: 'How do real product names, prices, form labels, errors and normal/focus/selected controls express the chosen identity, and what rendered specimens support those decisions?' },
            { id: 'proportion_and_familiarity', question: 'If the different redesign still feels awkward, which choices were overcorrected? Do brand, headline, imagery and controls have credible proportions for this service, and what actual comparison or user preference supports the calibration without overriding accepted expressive choices?' },
            { id: 'rejected_bundle_recheck', question: 'Which rejected relationships changed and which stayed for a useful reason? If the combined treatment remains, is the visual repair recorded as unchanged or failed separately from passing functional checks?' },
            { id: 'identity_continuity', question: 'What was created or strengthened across the whole page and useful states, and what current rendered evidence supports that judgment?' },
            { id: 'coherent_execution', question: 'Do type, palette, composition, imagery and interaction form a coherent whole rather than a cosmetic reskin?' },
            { id: 'rendered_critique', question: 'Which specific rendered weaknesses were improved at page and detail scale, and which remain?' },
            { id: 'preserved_behavior', question: 'Do meaningful content, controls, responsive states and recovery paths still work?' }
          ]
        },
        assurance: 'Contextual visual review requires current rendered evidence; source checks do not assess taste.',
        criteria: visualQualityRuleIds.map(ruleId => catalog.byId.get(ruleId)).filter(Boolean).map(rule => ({
          ruleId: rule.id, title: rule.title, guidance: rule.guidance,
          verification: rule.verification, status: 'not_assessed', evidence: [], score: null
        }))
      }
    } : {}),
    steps
  };
}
