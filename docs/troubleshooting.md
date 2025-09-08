# Troubleshooting Guide

## Overview

This troubleshooting guide helps diagnose and resolve common issues with the Flash Loan Arbitrage Bot Simulator. Issues are organized by category with step-by-step solutions and prevention strategies.

## Installation Issues

### Node.js Version Compatibility

**Problem**: Installation fails with Node.js version errors
```
error This project requires Node.js version 16 or higher
```

**Solution**:
```bash
# Check current Node.js version
node --version

# If version is below 16, update Node.js
# Using NVM (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

**Prevention**: Always use the latest LTS version of Node.js

### npm Install Failures

**Problem**: Dependencies fail to install
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use legacy peer deps**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update npm**:
   ```bash
   npm install -g npm@latest
   ```

4. **Check disk space**:
   ```bash
   df -h  # Ensure sufficient disk space
   ```

### Permission Errors

**Problem**: Permission denied during installation
```
Error: EACCES: permission denied
```

**Solutions**:

1. **Fix npm permissions**:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) /usr/local/lib/node_modules
   ```

2. **Use npx instead of global installs**:
   ```bash
   npx create-react-app instead of npm install -g create-react-app
   ```

## Environment Configuration Issues

### Missing Environment Variables

**Problem**: Application fails to start due to missing environment variables
```
Error: Missing required environment variables: GEMINI_API_KEY
```

**Solution**:
```bash
# Create .env.local file
touch .env.local

# Add required variables
echo "GEMINI_API_KEY=your_api_key_here" >> .env.local

# Verify file contents
cat .env.local
```

**Prevention**: Use environment variable validation in your build process

### Invalid API Keys

**Problem**: API requests fail with authentication errors
```
Error 401: Invalid API key
```

**Solutions**:

1. **Verify API key format**:
   ```javascript
   // API key should start with "AIza"
   const isValidKey = apiKey.startsWith('AIza') && apiKey.length > 30;
   ```

2. **Check API key permissions**:
   - Ensure Gemini API is enabled
   - Verify API key has correct permissions
   - Check usage quotas

3. **Test API key manually**:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        "https://generativelanguage.googleapis.com/v1/models"
   ```

### Environment Variable Loading Issues

**Problem**: Environment variables not loading in production
```
process.env.GEMINI_API_KEY is undefined
```

**Solutions**:

1. **Check Vite configuration**:
   ```typescript
   // vite.config.ts
   export default defineConfig(({ mode }) => {
     const env = loadEnv(mode, '.', '');
     return {
       define: {
         'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
       }
     };
   });
   ```

2. **Verify platform-specific settings**:
   - **Vercel**: Check Environment Variables in dashboard
   - **Netlify**: Verify Site Settings → Environment Variables
   - **GitHub Pages**: Check Repository Secrets

## Build Issues

### TypeScript Compilation Errors

**Problem**: TypeScript compilation fails
```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'
```

**Solutions**:

1. **Check TypeScript configuration**:
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "skipLibCheck": true,
       "esModuleInterop": true
     }
   }
   ```

2. **Fix type mismatches**:
   ```typescript
   // Before (incorrect)
   const price: number = pool.reserveB / pool.reserveA;
   
   // After (correct)
   const price: number = Number(pool.reserveB) / Number(pool.reserveA);
   ```

3. **Add type assertions when necessary**:
   ```typescript
   const element = document.getElementById('root') as HTMLElement;
   ```

### Vite Build Failures

**Problem**: Vite build process fails
```
Error: Build failed with errors
```

**Solutions**:

1. **Check memory usage**:
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 node_modules/.bin/vite build
   ```

2. **Clear Vite cache**:
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

3. **Check for circular dependencies**:
   ```bash
   npx madge --circular --extensions ts,tsx src/
   ```

### Bundle Size Issues

**Problem**: Bundle size too large, affecting performance
```
Warning: Large bundle size detected (>1MB)
```

**Solutions**:

1. **Analyze bundle size**:
   ```bash
   npm run build -- --analyze
   ```

2. **Implement code splitting**:
   ```typescript
   // Lazy load components
   const MarketAnalysis = lazy(() => import('./components/MarketAnalysis'));
   
   // Use Suspense
   <Suspense fallback={<div>Loading...</div>}>
     <MarketAnalysis />
   </Suspense>
   ```

3. **Optimize dependencies**:
   ```typescript
   // Import only what you need
   import { LineChart } from 'recharts';  // ✓ Good
   import * as recharts from 'recharts';  // ✗ Bad
   ```

## Runtime Issues

### React Hooks Errors

**Problem**: Invalid hook usage
```
Error: Invalid hook call. Hooks can only be called inside function components
```

**Solutions**:

1. **Check hook placement**:
   ```typescript
   // ✓ Correct - inside function component
   function MyComponent() {
     const [state, setState] = useState(initial);
     return <div>{state}</div>;
   }
   
   // ✗ Incorrect - outside component
   const [state, setState] = useState(initial);
   function MyComponent() {
     return <div>{state}</div>;
   }
   ```

2. **Verify React version compatibility**:
   ```bash
   npm list react react-dom
   ```

### State Management Issues

**Problem**: State updates not reflecting in UI
```
State changes but component doesn't re-render
```

**Solutions**:

1. **Check for state mutations**:
   ```typescript
   // ✗ Bad - mutating state directly
   pools[0].reserveA = newValue;
   setPools(pools);
   
   // ✓ Good - immutable update
   setPools(prevPools => 
     prevPools.map(pool => 
       pool.id === '0' 
         ? { ...pool, reserveA: newValue }
         : pool
     )
   );
   ```

2. **Use functional updates for dependent state**:
   ```typescript
   // ✓ Good - functional update
   setTotalProfit(prev => prev + trade.netProfit);
   
   // ✗ Bad - using stale closure
   setTotalProfit(totalProfit + trade.netProfit);
   ```

### Memory Leaks

**Problem**: Application slows down over time, high memory usage
```
Uncaught RangeError: Maximum call stack size exceeded
```

**Solutions**:

1. **Clean up intervals and timeouts**:
   ```typescript
   useEffect(() => {
     const interval = setInterval(() => {
       // Update logic
     }, 1000);
     
     return () => clearInterval(interval);  // ✓ Cleanup
   }, []);
   ```

2. **Remove event listeners**:
   ```typescript
   useEffect(() => {
     const handleResize = () => {
       // Handle resize
     };
     
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
   }, []);
   ```

3. **Limit array sizes**:
   ```typescript
   // Limit trade history
   setTrades(prev => [...prev.slice(-99), newTrade]);
   ```

## Performance Issues

### Slow Rendering

**Problem**: UI becomes unresponsive during simulation
```
React DevTools shows long render times
```

**Solutions**:

1. **Use React.memo for expensive components**:
   ```typescript
   const TradeLog = React.memo(({ trades, onTradeClick }) => {
     // Component logic
   });
   ```

2. **Optimize re-renders with useCallback**:
   ```typescript
   const handleTradeClick = useCallback((trade: Trade) => {
     setSelectedTrade(trade);
     setIsModalOpen(true);
   }, []);
   ```

3. **Virtualize long lists**:
   ```typescript
   // Use react-window for large trade lists
   import { FixedSizeList as List } from 'react-window';
   
   <List
     height={600}
     itemCount={trades.length}
     itemSize={60}
     itemData={trades}
   >
     {TradeRow}
   </List>
   ```

### High CPU Usage

**Problem**: Browser tab consumes high CPU
```
Chrome Task Manager shows >50% CPU usage
```

**Solutions**:

1. **Optimize update intervals**:
   ```typescript
   // Reduce update frequency
   const MARKET_UPDATE_INTERVAL = 3000;  // 3 seconds instead of 1
   ```

2. **Use requestAnimationFrame for animations**:
   ```typescript
   useEffect(() => {
     let animationId: number;
     
     const animate = () => {
       // Animation logic
       animationId = requestAnimationFrame(animate);
     };
     
     animate();
     return () => cancelAnimationFrame(animationId);
   }, []);
   ```

3. **Debounce expensive operations**:
   ```typescript
   import { debounce } from 'lodash';
   
   const debouncedUpdate = useMemo(
     () => debounce(updateMarketData, 1000),
     []
   );
   ```

## API Integration Issues

### Gemini API Errors

**Problem**: AI market analysis fails
```
Error: Failed to fetch market analysis
```

**Solutions**:

1. **Check API quotas**:
   ```bash
   # Monitor API usage in Google Cloud Console
   ```

2. **Implement retry logic**:
   ```typescript
   async function getMarketAnalysisWithRetry(maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await getMarketAnalysis();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   }
   ```

3. **Add fallback responses**:
   ```typescript
   const FALLBACK_ANALYSIS = `
     Market analysis temporarily unavailable. 
     Current conditions suggest moderate volatility with 
     standard arbitrage opportunities present.
   `;
   ```

### Network Connectivity Issues

**Problem**: API requests timeout or fail
```
TypeError: Failed to fetch
```

**Solutions**:

1. **Check CORS configuration**:
   ```typescript
   // Ensure API endpoints allow your origin
   const response = await fetch(url, {
     mode: 'cors',
     headers: {
       'Content-Type': 'application/json',
     }
   });
   ```

2. **Implement timeout handling**:
   ```typescript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 10000);
   
   try {
     const response = await fetch(url, {
       signal: controller.signal
     });
     clearTimeout(timeoutId);
   } catch (error) {
     if (error.name === 'AbortError') {
       console.log('Request timed out');
     }
   }
   ```

## Browser Compatibility Issues

### Older Browser Support

**Problem**: Application doesn't work in older browsers
```
Uncaught SyntaxError: Unexpected token '=>'
```

**Solutions**:

1. **Check browser support**:
   ```json
   // package.json
   {
     "browserslist": [
       "> 1%",
       "last 2 versions",
       "not dead"
     ]
   }
   ```

2. **Add polyfills**:
   ```typescript
   // Add to index.html
   <script src="https://polyfill.io/v3/polyfill.min.js"></script>
   ```

3. **Use Babel for transpilation**:
   ```bash
   npm install @babel/preset-env
   ```

### Mobile Compatibility

**Problem**: Poor mobile experience
```
Touch interactions not working properly
```

**Solutions**:

1. **Add mobile-specific CSS**:
   ```css
   @media (max-width: 768px) {
     .dashboard-panel {
       padding: 1rem;
       font-size: 14px;
     }
   }
   ```

2. **Handle touch events**:
   ```typescript
   const handleTouchStart = (e: TouchEvent) => {
     e.preventDefault();
     // Handle touch
   };
   ```

## Development Environment Issues

### Hot Reload Not Working

**Problem**: Changes don't reflect automatically
```
Vite HMR not updating components
```

**Solutions**:

1. **Check Vite configuration**:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     server: {
       hmr: {
         overlay: true
       }
     }
   });
   ```

2. **Restart development server**:
   ```bash
   # Stop server (Ctrl+C) then restart
   npm run dev
   ```

3. **Clear browser cache**:
   ```bash
   # Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   ```

### Port Already in Use

**Problem**: Default port 5173 is occupied
```
Error: Port 5173 is already in use
```

**Solutions**:

1. **Use different port**:
   ```bash
   npm run dev -- --port 3000
   ```

2. **Kill process using port**:
   ```bash
   # Find process using port
   lsof -ti:5173
   
   # Kill process
   kill -9 $(lsof -ti:5173)
   ```

## Deployment Issues

### Build Artifacts Missing

**Problem**: Deployment fails due to missing build files
```
Error: No such file or directory: dist/index.html
```

**Solution**:
```bash
# Ensure build completes successfully
npm run build
ls -la dist/  # Verify files exist
```

### Environment Variables Not Working in Production

**Problem**: API calls fail in production due to missing environment variables

**Solutions**:

1. **Verify platform-specific configuration**:
   - **Vercel**: Check Project Settings → Environment Variables
   - **Netlify**: Check Site Settings → Environment Variables
   - **AWS**: Check Lambda/ECS environment configuration

2. **Test environment variable injection**:
   ```typescript
   console.log('Environment check:', {
     NODE_ENV: process.env.NODE_ENV,
     HAS_API_KEY: !!process.env.GEMINI_API_KEY
   });
   ```

## Debugging Strategies

### Enable Debug Logging

```typescript
// Add to App.tsx
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Use throughout application
debugLog('Trade detected', opportunity);
```

### Performance Profiling

```typescript
// Add performance markers
performance.mark('arbitrage-detection-start');
// ... arbitrage detection logic
performance.mark('arbitrage-detection-end');
performance.measure('arbitrage-detection', 'arbitrage-detection-start', 'arbitrage-detection-end');

// View results in DevTools Performance tab
```

### Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Getting Help

### Before Asking for Help

1. **Check the console** for error messages
2. **Review this troubleshooting guide**
3. **Search existing GitHub issues**
4. **Try the problem in a fresh environment**

### When Creating an Issue

Include the following information:

- **Operating System**: (e.g., macOS 12.0, Windows 11, Ubuntu 20.04)
- **Node.js Version**: `node --version`
- **npm Version**: `npm --version`
- **Browser**: (e.g., Chrome 96, Firefox 94)
- **Error Messages**: Complete error text and stack traces
- **Steps to Reproduce**: Detailed steps that led to the issue
- **Expected Behavior**: What should have happened
- **Screenshots**: If UI-related issue

### Contact Information

- **GitHub Issues**: [Create an issue](https://github.com/Dmoore628/Flash-Loan-Arbitrage-Bot-/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Dmoore628/Flash-Loan-Arbitrage-Bot-/discussions)

---

This troubleshooting guide covers the most common issues. If you encounter a problem not listed here, please create an issue on GitHub with detailed information to help improve this guide.