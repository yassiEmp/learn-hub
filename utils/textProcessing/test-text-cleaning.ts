// ============================================================================
// Text Cleaning Test - Demonstrates Intelligent Information Preservation
// ============================================================================

import { 
  cleanText, 
  removeNoise, 
  extractImportantInfo,
  preprocessText 
} from './preprocessor/textCleaner';

// Test text with various types of important information
const testText = `
# React Development Course

Contact us at john.doe@example.com or call (555) 123-4567 for more information.

## Course Details

The course costs $299.99 and runs from 12/15/2024 to 01/15/2025.
Visit our website: https://example.com/react-course

### Key Topics

* React components and props
* State management with hooks
* Event handling in React
* Conditional rendering
* Lists and keys

### Important Numbers

- React version: 18.2.0
- Course duration: 40 hours
- Success rate: 95%
- Student satisfaction: 4.8/5

### Code Examples

\`\`\`javascript
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

Inline code: \`useState\` and \`useEffect\` hooks.

### Contact Information

- Email: support@example.com
- Phone: 1-800-555-0123
- Address: 123 Main St, Anytown, CA 90210
- Website: https://support.example.com

> Important: This course requires basic JavaScript knowledge.

**Note**: All times are in PST (Pacific Standard Time).
`;

function testTextCleaning() {
  console.log('🧪 Testing Intelligent Text Cleaning...\n');
  
  console.log('📝 Original Text:');
  console.log(testText);
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Test 1: Basic cleaning
  console.log('🔧 Test 1: Basic Text Cleaning');
  const basicCleaned = cleanText(testText);
  console.log('Result:', basicCleaned.substring(0, 200) + '...');
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Test 2: Noise removal
  console.log('🧹 Test 2: Noise Removal');
  const noiseRemoved = removeNoise(testText);
  console.log('Result:', noiseRemoved.substring(0, 200) + '...');
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Test 3: Improved cleaning
  console.log('🧠 Test 3: Improved Text Cleaning');
  const improvedCleaned = cleanText(testText);
  console.log('Result:', improvedCleaned.substring(0, 200) + '...');
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Test 4: Important information extraction
  console.log('📊 Test 4: Important Information Extraction');
  const importantInfo = extractImportantInfo(testText);
  console.log('📧 Emails found:', importantInfo.emails);
  console.log('🔗 URLs found:', importantInfo.urls);
  console.log('📞 Phone numbers found:', importantInfo.phoneNumbers);
  console.log('📅 Dates found:', importantInfo.dates);
  console.log('🔢 Numbers found:', importantInfo.numbers);
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Test 5: Complete preprocessing
  console.log('🚀 Test 5: Complete Preprocessing Pipeline');
  const processed = preprocessText(testText);
  console.log('✅ Processing successful!');
  console.log('📏 Original length:', processed.metadata.originalLength);
  console.log('📏 Cleaned length:', processed.metadata.cleanedLength);
  console.log('🧹 Noise removed:', processed.metadata.removedNoise);
  console.log('🔄 Duplicates removed:', processed.metadata.removedDuplicates);
  console.log('📧 Emails preserved:', processed.metadata.importantInfo.emails.length);
  console.log('🔗 URLs preserved:', processed.metadata.importantInfo.urls.length);
  console.log('📞 Phone numbers preserved:', processed.metadata.importantInfo.phoneNumbers.length);
  console.log('📅 Dates preserved:', processed.metadata.importantInfo.dates.length);
  console.log('🔢 Numbers preserved:', processed.metadata.importantInfo.numbers.length);
  
  console.log('\n📖 Final cleaned text preview:');
  console.log(processed.cleaned.substring(0, 300) + '...');
  
  console.log('\n📊 Content Analysis:');
  console.log('- Language:', processed.analysis.language);
  console.log('- Type:', processed.analysis.type);
  console.log('- Complexity:', processed.analysis.complexity);
  console.log('- Topics:', processed.analysis.topics);
  console.log('- Keywords:', processed.analysis.keywords.slice(0, 5));
  console.log('- Reading time:', processed.analysis.estimatedReadingTime, 'minutes');
  console.log('- Readability score:', processed.analysis.readabilityScore.toFixed(1));
}

// Test with different types of content
function testEdgeCases() {
  console.log('\n🧪 Testing Edge Cases...\n');
  
  const edgeCases = [
    {
      name: 'Technical content with code',
      text: 'Use `npm install react` to install React. The current version is 18.2.0. Visit https://reactjs.org for docs.'
    },
    {
      name: 'Contact information',
      text: 'Email: contact@company.com, Phone: (555) 123-4567, Address: 123 Main St, ZIP: 90210'
    },
    {
      name: 'Financial data',
      text: 'Revenue: $1,234,567.89, Growth: 15.5%, Date: 12/31/2024, Time: 14:30'
    },
    {
      name: 'Mixed formatting',
      text: '**Bold text** and *italic text* with `inline code` and [links](https://example.com)'
    }
  ];
  
  edgeCases.forEach(({ name, text }) => {
    console.log(`📝 ${name}:`);
    console.log('Original:', text);
    const processed = preprocessText(text);
    console.log('Cleaned:', processed.cleaned);
    console.log('Important info:', processed.metadata.importantInfo);
    console.log('\n' + '-'.repeat(40) + '\n');
  });
}

// Run tests
if (require.main === module) {
  testTextCleaning();
  testEdgeCases();
}

export { testTextCleaning, testEdgeCases }; 