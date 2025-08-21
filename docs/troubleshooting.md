# Troubleshooting Guide

Common issues and solutions for BapBapBapBapBap.

## 🚀 Installation Issues

### Node.js and Dependencies

#### "Node.js version not supported"
**Symptoms**: Build fails with version error
**Solution**:
```bash
node --version  # Check current version
nvm install 18  # Install Node.js 18 (if using nvm)
nvm use 18      # Switch to Node.js 18
npm install     # Reinstall dependencies
```

#### "Package not found" or dependency errors
**Symptoms**: Import errors, missing modules
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Permission errors during npm install
**Symptoms**: EACCES errors
**Solution**:
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Database Issues

#### "Can't connect to database"
**Symptoms**: Database connection errors, Prisma failures
**Diagnostics**:
```bash
# Check if PostgreSQL is running
pg_ctl status
# or
brew services list | grep postgresql

# Test database connection
psql $DATABASE_URL
```

**Solutions**:
1. **Start PostgreSQL**:
   ```bash
   # macOS with Homebrew
   brew services start postgresql
   
   # Linux with systemctl
   sudo systemctl start postgresql
   
   # Manual start
   pg_ctl -D /usr/local/var/postgres start
   ```

2. **Verify database exists**:
   ```bash
   psql -U postgres -l | grep bapbapbapbapbap
   ```

3. **Create database if missing**:
   ```bash
   createdb bapbapbapbapbap
   ```

4. **Fix connection string**:
   Check `.env.local` for correct `DATABASE_URL` format:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/bapbapbapbapbap"
   ```

#### "Schema drift detected" or Prisma errors
**Symptoms**: Database schema doesn't match Prisma schema
**Solution**:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### "Settings table doesn't exist"
**Symptoms**: Global scale settings not working
**Solution**:
```bash
# Run migration endpoint
curl -X POST http://localhost:3000/api/migrate

# Or manual database update
psql $DATABASE_URL -c "
CREATE TABLE IF NOT EXISTS \"Settings\" (
  \"id\" INTEGER PRIMARY KEY DEFAULT 1,
  \"globalScale\" DOUBLE PRECISION DEFAULT 1.0
);
INSERT INTO \"Settings\" (\"id\", \"globalScale\") 
VALUES (1, 1.0) 
ON CONFLICT (\"id\") DO NOTHING;
"
```

### Vercel Blob Storage Issues

#### "Blob upload failed" or "Invalid token"
**Symptoms**: File uploads fail in admin panel
**Diagnostics**:
```bash
# Check token in environment
echo $BLOB_READ_WRITE_TOKEN
```

**Solutions**:
1. **Verify token permissions**:
   - Go to Vercel dashboard
   - Check Blob storage settings
   - Ensure token has "Read and Write" permissions

2. **Regenerate token**:
   - Delete old token in Vercel dashboard
   - Create new token with correct permissions
   - Update `.env.local`

3. **Test token manually**:
   ```bash
   curl -X POST https://blob.vercel-storage.com/test \
     -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN"
   ```

#### File size limits
**Symptoms**: Large files fail to upload
**Solutions**:
- Compress audio files (target < 5MB)
- Use MP3 format for smaller file sizes
- Check Vercel account limits

## 🎮 Application Issues

### Audio Problems

#### No audio playing when tapping zones
**Symptoms**: Animations work but no sound
**Diagnostics**:
1. Open browser developer console
2. Look for audio-related errors
3. Check browser audio permissions

**Solutions**:
1. **Browser permissions**:
   - Click the audio/speaker icon in address bar
   - Allow audio for the site
   - Refresh the page

2. **Check audio samples**:
   - Go to admin panel
   - Verify samples are uploaded for active zones
   - Test sample playback using preview button

3. **Audio format issues**:
   - Try different audio formats (MP3, WAV)
   - Ensure audio files aren't corrupted
   - Check file sizes (< 10MB)

4. **System audio**:
   - Check system volume is up
   - Verify other audio works in browser
   - Try different browser

#### Audio cutting out or distorted
**Symptoms**: Audio starts but stops abruptly
**Solutions**:
- Reduce number of simultaneous taps
- Check internet connection stability
- Try shorter audio samples (< 30 seconds)
- Lower audio sample rate/quality

### Visual Issues

#### Animations not appearing or black screen
**Symptoms**: Screen is black, no visual feedback
**Diagnostics**:
1. Open browser console (F12)
2. Look for PIXI.js or WebGL errors
3. Check if canvas element exists

**Solutions**:
1. **WebGL support**:
   - Visit `chrome://gpu/` to check WebGL status
   - Enable hardware acceleration in browser
   - Try different browser

2. **Canvas rendering**:
   ```javascript
   // Check in console
   console.log(window.__pixiApp);
   ```

3. **Clear browser cache**:
   - Hard refresh (Ctrl+Shift+F5 or Cmd+Shift+R)
   - Clear browser data
   - Try incognito/private mode

#### Animations are too small/large
**Symptoms**: Visual effects don't match expected size
**Solutions**:
1. **Check global scale**:
   - Go to admin panel
   - Adjust global animation scale
   - Click "Save Changes"

2. **Browser zoom**:
   - Reset browser zoom to 100%
   - Check viewport meta tag

3. **Device scaling**:
   - Adjust system display scaling
   - Try different screen resolution

#### Poor animation performance
**Symptoms**: Choppy, slow, or laggy animations
**Solutions**:
1. **Browser optimization**:
   - Close other tabs and applications
   - Enable hardware acceleration
   - Try different browser

2. **Reduce complexity**:
   - Lower global animation scale
   - Reduce number of active zones
   - Use simpler animation types

3. **Hardware considerations**:
   - Ensure adequate GPU performance
   - Check system resources (CPU, memory)
   - Try on different device

### Admin Panel Issues

#### Can't access admin panel
**Symptoms**: Password prompt doesn't work, 401 errors
**Solutions**:
1. **Check admin password**:
   - Verify `ADMIN_SECRET` in `.env.local`
   - Ensure no extra spaces or characters
   - Try regenerating password

2. **Clear browser data**:
   - Clear cookies and site data
   - Try different browser
   - Use incognito mode

3. **Check middleware**:
   ```bash
   # Verify middleware is working
   curl http://localhost:3000/admin
   ```

#### File uploads fail in admin
**Symptoms**: Drag-and-drop doesn't work, upload errors
**Solutions**:
1. **File format validation**:
   - Use supported formats: MP3, WAV, M4A, OGG
   - Check file isn't corrupted
   - Try smaller file sizes

2. **Browser permissions**:
   - Allow file access permissions
   - Disable ad blockers temporarily
   - Check browser security settings

3. **Network issues**:
   - Check internet connection
   - Try uploading one file at a time
   - Verify Vercel Blob storage status

## 🌐 Deployment Issues

### Vercel Deployment Problems

#### Build failures
**Symptoms**: Deployment fails during build step
**Solutions**:
1. **Check build logs**:
   - Review Vercel deployment logs
   - Look for specific error messages
   - Check for missing environment variables

2. **Local build test**:
   ```bash
   npm run build
   ```

3. **Dependency issues**:
   - Ensure `package-lock.json` is committed
   - Check for version conflicts
   - Try clearing node_modules and reinstalling

#### Database connection issues in production
**Symptoms**: App works locally but fails in production
**Solutions**:
1. **Environment variables**:
   - Verify all environment variables are set in Vercel
   - Check `DATABASE_URL` format
   - Ensure no trailing spaces

2. **Database accessibility**:
   - Verify database allows external connections
   - Check firewall and security group settings
   - Test connection from Vercel functions

3. **Schema synchronization**:
   ```bash
   # Deploy schema changes
   npx prisma db push
   ```

#### Performance issues in production
**Symptoms**: Slow loading, timeouts
**Solutions**:
- Enable Vercel Edge Functions
- Optimize image and audio file sizes
- Check Vercel analytics for bottlenecks
- Consider upgrading Vercel plan

### Domain and SSL Issues

#### Custom domain not working
**Symptoms**: Domain shows Vercel default page or errors
**Solutions**:
1. **DNS configuration**:
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (up to 48 hours)
   - Use DNS checker tools

2. **Vercel domain settings**:
   - Add domain in Vercel dashboard
   - Verify domain ownership
   - Check SSL certificate status

## 🔧 Development Issues

### Hot Reload Problems

#### Changes not reflecting in browser
**Symptoms**: Code changes don't appear after saving
**Solutions**:
1. **Restart development server**:
   ```bash
   # Stop with Ctrl+C, then restart
   npm run dev
   ```

2. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Browser cache**:
   - Hard refresh (Ctrl+Shift+F5)
   - Disable browser cache in dev tools

### TypeScript Issues

#### Type errors that don't make sense
**Symptoms**: TypeScript compiler errors
**Solutions**:
```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Or clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

### Performance Debugging

#### Identifying bottlenecks
**Tools and techniques**:
1. **Browser DevTools**:
   - Performance tab for CPU profiling
   - Memory tab for memory leaks
   - Network tab for loading issues

2. **Console logging**:
   ```javascript
   console.time('animation-render');
   // Animation code
   console.timeEnd('animation-render');
   ```

3. **PIXI.js debugging**:
   ```javascript
   // Enable PIXI dev mode
   PIXI.utils.skipHello();
   ```

## 📱 Browser Compatibility

### Mobile Device Issues

#### Touch not working properly
**Symptoms**: Taps don't register correctly
**Solutions**:
- Ensure viewport meta tag is correct
- Test touch events in different browsers
- Check for conflicting touch event handlers

#### Performance on mobile
**Symptoms**: Slow or choppy animations on mobile
**Solutions**:
- Reduce particle counts for mobile
- Use simpler animations on smaller screens
- Implement device detection for optimization

### Browser-Specific Issues

#### Safari issues
**Common problems**:
- Audio playback restrictions
- WebGL context limitations
- Touch event differences

**Solutions**:
- Require user interaction before audio
- Implement Safari-specific fallbacks
- Test thoroughly on iOS devices

#### Firefox issues
**Common problems**:
- Different WebGL behavior
- Audio format support variations

**Solutions**:
- Test multiple audio formats
- Check WebGL extension support

## 🆘 Getting Help

### Gathering Debug Information

When reporting issues, include:
1. **Browser and version**
2. **Operating system**
3. **Console error messages**
4. **Steps to reproduce**
5. **Expected vs actual behavior**

### Debug Information Script
```javascript
// Run in browser console to gather system info
const debugInfo = {
  userAgent: navigator.userAgent,
  pixiSupport: !!window.PIXI,
  webglSupport: !!document.createElement('canvas').getContext('webgl'),
  audioSupport: !!window.AudioContext || !!window.webkitAudioContext,
  pixiApp: !!window.__pixiApp,
  url: window.location.href,
  timestamp: new Date().toISOString()
};
console.log(JSON.stringify(debugInfo, null, 2));
```

### Support Channels
- **GitHub Issues**: [Report bugs](https://github.com/MattKilmer/bapbapbapbapbap/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/MattKilmer/bapbapbapbapbap/discussions)
- **Email**: mvkilmer@hotmail.com

### Before Reporting Issues
1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Try reproducing in different browser/device
4. Gather debug information

---

**Still having issues? Don't hesitate to [open an issue](https://github.com/MattKilmer/bapbapbapbapbap/issues) with detailed information!** 🛠️