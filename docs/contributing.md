# Contributing Guidelines

## Welcome Contributors! 🎉

Thank you for your interest in contributing to the Flash Loan Arbitrage Bot Simulator! This project benefits from community contributions, whether through bug reports, feature suggestions, documentation improvements, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Contributing Process](#contributing-process)
- [Code Guidelines](#code-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race
- Ethnicity
- Age
- Religion
- Nationality

### Expected Behavior

- **Be respectful** and considerate in all interactions
- **Be collaborative** and help others learn and grow
- **Be constructive** when providing feedback
- **Focus on the issue**, not the person
- **Ask questions** when you don't understand something

### Unacceptable Behavior

- Harassment, discrimination, or intimidation
- Trolling, insulting comments, or personal attacks
- Publishing private information without consent
- Any conduct that would be inappropriate in a professional setting

## Getting Started

### Ways to Contribute

1. **Report Bugs** - Help us identify and fix issues
2. **Suggest Features** - Propose new functionality or improvements
3. **Improve Documentation** - Enhance guides, tutorials, or API docs
4. **Submit Code** - Fix bugs, implement features, or optimize performance
5. **Review Pull Requests** - Help evaluate and improve contributions
6. **Share Ideas** - Participate in discussions about the project direction

### Before You Start

1. **Check existing issues** to avoid duplicating work
2. **Read the documentation** to understand the project
3. **Try the application** to familiarize yourself with its features
4. **Join discussions** to understand current priorities

## Development Environment

### Prerequisites

- **Node.js** 16+ (recommended: 18+)
- **npm** 7+ or **yarn** 1.22+
- **Git** for version control
- **Code editor** (recommended: VS Code with TypeScript extensions)

### Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Flash-Loan-Arbitrage-Bot-.git
   cd Flash-Loan-Arbitrage-Bot-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Verify setup**:
   - Application loads at `http://localhost:5173`
   - No console errors
   - All features work as expected

### Development Tools

#### Recommended VS Code Extensions

- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

#### Browser Dev Tools

- **React Developer Tools**
- **Redux DevTools** (if applicable)
- **Performance** tab for profiling
- **Network** tab for API monitoring

### Project Structure

```
Flash-Loan-Arbitrage-Bot/
├── src/
│   ├── components/          # React UI components
│   │   ├── Header.tsx
│   │   ├── DashboardPanel.tsx
│   │   └── ...
│   ├── services/            # External service integrations
│   │   └── geminiService.ts
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── docs/                    # Documentation files
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # Project overview
```

## Contributing Process

### 1. Issue Creation

Before starting work, create or find an issue:

#### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should have happened

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node.js: [e.g., 18.0.0]
```

#### Feature Requests

Use the feature request template:

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this be implemented?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Any other relevant information
```

### 2. Development Workflow

#### Branching Strategy

- **main** - Production-ready code
- **develop** - Development branch (if applicable)
- **feature/feature-name** - New features
- **fix/bug-description** - Bug fixes
- **docs/documentation-update** - Documentation changes

#### Creating a Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/arbitrage-optimization

# Or for bug fixes
git checkout -b fix/price-calculation-error
```

#### Making Changes

1. **Keep commits small and focused**
2. **Write descriptive commit messages**
3. **Test your changes thoroughly**
4. **Update documentation if needed**

#### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(trading): add triangular arbitrage detection
fix(ui): resolve dashboard rendering issue
docs(readme): update installation instructions
style(components): format code with prettier
refactor(types): improve interface definitions
test(trading): add unit tests for profit calculation
chore(deps): update react to version 18
```

### 3. Pull Request Process

#### Before Submitting

- [ ] **Code builds successfully** (`npm run build`)
- [ ] **All tests pass** (if tests exist)
- [ ] **Code follows style guidelines**
- [ ] **Documentation is updated**
- [ ] **No console errors or warnings**
- [ ] **Self-review completed**

#### PR Title and Description

**Title Format**: `type(scope): brief description`

**Description Template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Changes Made
- List of specific changes
- Another change
- One more change

## Testing
- [ ] Tested locally
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
Include screenshots for UI changes

## Additional Notes
Any additional information for reviewers
```

#### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** promptly
4. **Final approval** and merge

## Code Guidelines

### TypeScript Standards

#### Type Definitions

```typescript
// ✓ Good: Explicit interfaces
interface Trade {
  id: string;
  timestamp: Date;
  amount: number;
  netProfit: number;
}

// ✗ Bad: Any types
const trade: any = { /* ... */ };

// ✓ Good: Generic types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// ✓ Good: Union types
type BotStatus = 'LIVE' | 'STOPPED' | 'BACKTESTING';
```

#### Function Types

```typescript
// ✓ Good: Explicit return types
function calculateProfit(trade: Trade): number {
  return trade.grossProfit - trade.gasFee;
}

// ✓ Good: Async function types
async function fetchMarketData(): Promise<LiquidityPool[]> {
  // Implementation
}

// ✓ Good: Arrow function types
const handleTradeClick = useCallback((trade: Trade): void => {
  setSelectedTrade(trade);
}, []);
```

### React Best Practices

#### Component Structure

```typescript
// ✓ Good: Functional component with proper typing
interface DashboardProps {
  status: BotStatus;
  onStartTrading: () => void;
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  status, 
  onStartTrading, 
  trades 
}) => {
  // Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Event handlers
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  
  // Render
  return (
    <div className="dashboard">
      {/* Component JSX */}
    </div>
  );
};

export default Dashboard;
```

#### State Management

```typescript
// ✓ Good: Immutable state updates
const updateTrade = useCallback((tradeId: string, updates: Partial<Trade>) => {
  setTrades(prevTrades => 
    prevTrades.map(trade => 
      trade.id === tradeId 
        ? { ...trade, ...updates }
        : trade
    )
  );
}, []);

// ✓ Good: Functional state updates
const addProfit = useCallback((profit: number) => {
  setTotalProfit(prev => prev + profit);
}, []);
```

#### Hook Usage

```typescript
// ✓ Good: Custom hooks for reusable logic
function useArbitrageDetection(pools: LiquidityPool[]) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  
  useEffect(() => {
    const detected = detectArbitrageOpportunities(pools);
    setOpportunities(detected);
  }, [pools]);
  
  return opportunities;
}

// ✓ Good: Effect cleanup
useEffect(() => {
  const interval = setInterval(updateMarketData, 1000);
  return () => clearInterval(interval);
}, []);
```

### CSS/Styling Guidelines

#### Tailwind CSS Classes

```typescript
// ✓ Good: Organized class names
const buttonClasses = [
  'px-4 py-2',                    // Spacing
  'bg-blue-500 hover:bg-blue-600', // Colors
  'text-white font-medium',       // Typography
  'rounded-lg transition-colors', // Appearance
  'focus:outline-none focus:ring-2' // Focus states
].join(' ');

// ✓ Good: Conditional classes
const statusClasses = `
  flex items-center space-x-2 rounded-full px-3 py-1.5 border
  ${status === 'LIVE' 
    ? 'bg-green-accent/10 border-green-accent text-green-accent' 
    : 'bg-red-accent/10 border-red-accent text-red-accent'
  }
`;
```

### Performance Guidelines

#### Optimization Techniques

```typescript
// ✓ Good: Memoized expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(largeDataSet);
}, [largeDataSet]);

// ✓ Good: Memoized components
const TradeItem = React.memo<TradeItemProps>(({ trade, onClick }) => {
  return (
    <div onClick={() => onClick(trade)}>
      {/* Trade content */}
    </div>
  );
});

// ✓ Good: Debounced updates
const debouncedSearch = useMemo(
  () => debounce(performSearch, 300),
  []
);
```

## Testing Guidelines

### Test Structure

```typescript
// Example test file: components/Dashboard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  const mockProps = {
    status: 'STOPPED' as const,
    onStartTrading: jest.fn(),
    trades: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dashboard with correct status', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText('STOPPED')).toBeInTheDocument();
  });

  it('should call onStartTrading when start button is clicked', () => {
    render(<Dashboard {...mockProps} />);
    
    fireEvent.click(screen.getByText('Start Trading'));
    
    expect(mockProps.onStartTrading).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Checklist

- [ ] **Component renders** without crashing
- [ ] **Props are handled** correctly
- [ ] **User interactions** work as expected
- [ ] **State changes** are reflected in UI
- [ ] **Error scenarios** are handled gracefully
- [ ] **Accessibility** is maintained

## Documentation Guidelines

### Code Documentation

```typescript
/**
 * Calculates the net profit for an arbitrage opportunity
 * @param grossProfit - Profit before fees and costs
 * @param gasFee - Network transaction fee in USD
 * @param loanFee - Flash loan provider fee in USD
 * @returns Net profit in USD
 */
function calculateNetProfit(
  grossProfit: number,
  gasFee: number,
  loanFee: number
): number {
  return grossProfit - gasFee - loanFee;
}

/**
 * Custom hook for managing arbitrage opportunities
 * @param pools - Array of liquidity pools to monitor
 * @param minProfit - Minimum profit threshold in USD
 * @returns Object containing opportunities and detection status
 */
function useArbitrageDetection(
  pools: LiquidityPool[],
  minProfit: number = 50
) {
  // Implementation
}
```

### README Updates

When adding new features, update relevant documentation:

- **Installation instructions** (if dependencies change)
- **Usage examples** (for new features)
- **Configuration options** (for new settings)
- **API documentation** (for new interfaces)

### Inline Comments

```typescript
// Calculate price impact based on AMM constant product formula
// x * y = k, where k must remain constant
const newReserveA = pool.reserveA + tradeAmount;
const newReserveB = (pool.reserveA * pool.reserveB) / newReserveA;
const priceImpact = Math.abs((newPrice - currentPrice) / currentPrice);

// Ensure trade doesn't exceed maximum slippage tolerance
if (priceImpact > MAX_SLIPPAGE) {
  throw new Error(`Slippage too high: ${priceImpact.toFixed(4)}%`);
}
```

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Reviews**: Code feedback and collaboration

### Getting Help

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Create a new issue** with detailed information
4. **Be patient and respectful** when asking for help

### Mentorship

New contributors can:

- **Start with "good first issue" labels**
- **Ask questions** in issues or discussions
- **Request mentorship** from maintainers
- **Pair program** with experienced contributors (if available)

## Recognition

Contributors are recognized through:

- **GitHub contributor list**
- **Release notes** acknowledgments
- **Special mention** for significant contributions
- **Maintainer status** for consistent contributors

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the Flash Loan Arbitrage Bot Simulator! Your efforts help make this project better for everyone in the DeFi community. 🚀