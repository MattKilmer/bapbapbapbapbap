# Admin Panel Guide

Complete guide to managing BapBapBapBapBap through the admin interface.

## 🔐 Accessing the Admin Panel

### URL
Navigate to `/admin` on your BapBapBapBapBap instance:
- **Local Development**: `http://localhost:3000/admin`
- **Production**: `https://yourdomain.com/admin`

### Authentication
- Enter the admin password (set in `ADMIN_SECRET` environment variable)
- Authentication persists for the browser session
- No username required - password only

## 🎛️ Admin Panel Overview

### Main Interface
The admin panel provides a dashboard with:
- **Zone Grid**: Visual representation of all 16 zones
- **Global Controls**: Site-wide settings and tools
- **Quick Stats**: Active zones and total samples count
- **Test Link**: Direct access to main app for testing

### Zone Cards
Each zone displays:
- **Zone Number**: 1-16 corresponding to grid position  
- **Status Indicator**: Green (active) or Red (inactive)
- **Animation Type**: Currently selected animation
- **Sample Count**: Number of uploaded audio files
- **Upload Area**: Drag-and-drop audio upload
- **Configuration Link**: Access to detailed zone settings

## 🌟 Global Animation Scale

### Control Interface
Located at the top of the admin panel in a purple-themed section:

- **Range Slider**: Adjust from 0.5x to 5x scaling
- **Live Preview**: Shows current scale value (e.g., "2.5x")
- **Save Button**: Commits changes to database
- **Status Indicator**: Shows saved/unsaved state

### Scale Options
| Scale | Effect | Use Case |
|-------|--------|----------|
| **0.5x** | Tiny animations | Subtle effects |
| **1.0x** | Default size | Standard experience |
| **1.5x** | Slightly larger | Enhanced visibility |
| **2.0x** | Double size | Dramatic effects |
| **3.0x** | Triple size | Large displays |
| **4.0x** | Quadruple size | Projection screens |
| **5.0x** | Maximum size | Massive installations |

### Real-time Updates
- Changes apply immediately to the main app
- No need to refresh main app - updates automatically via polling
- Settings persist across server restarts

## 🎨 Managing Zone Animations

### Changing Animation Types
1. **Locate the zone** you want to modify
2. **Click the animation dropdown** in the zone card
3. **Select new animation** from the list:
   - Burst, Ripple, Confetti, Waves
   - Spiral, Pulse, Lightning, Mandala
   - Tornado, Firework, Nebula, Matrix
   - Galaxy, Geometric, Plasma, Crystal

4. **Change applies instantly** - no save button needed

### Animation Descriptions
- **Burst**: Explosive radial particle burst
- **Ripple**: Expanding rings with trailing particles
- **Confetti**: Colorful particles with realistic gravity
- **Waves**: Fluid organic motion patterns
- **Spiral**: Particles following curved spiral paths
- **Pulse**: Rhythmic expanding/contracting rings
- **Lightning**: Electric discharge with branching
- **Mandala**: Complex geometric layered patterns
- **Tornado**: 3D vortex with height variation
- **Firework**: Explosive burst with trailing sparks
- **Nebula**: 3D orbital particle system
- **Matrix**: Cyberpunk-style character streams
- **Galaxy**: Stellar formation with gravity effects
- **Geometric**: Dynamic shape morphing
- **Plasma**: Energy field visualization
- **Crystal**: Hexagonal crystal formations

## 🎵 Audio Sample Management

### Uploading Audio Files

#### Supported Formats
- **MP3**: Most common, good compression
- **WAV**: High quality, larger files
- **M4A**: Apple format, good quality
- **OGG**: Open source format
- **WEBM**: Modern web format

#### File Requirements
- **Size Limit**: 10MB per file (recommended under 5MB)
- **Length**: 1-30 seconds recommended for best experience
- **Quality**: 44.1kHz, 16-bit minimum recommended

#### Upload Methods
**Drag and Drop**:
1. Drag audio files directly onto zone upload area
2. Multiple files can be uploaded simultaneously
3. Progress indicator shows upload status

**Click to Browse**:
1. Click the upload area in any zone
2. Select files using system file picker
3. Confirm upload

### Managing Existing Samples
Each uploaded sample displays:
- **File Name**: Original filename and label
- **Gain Level**: Volume adjustment in decibels (dB)
- **Play Button**: Preview the audio sample
- **Delete Button**: Remove the sample (🗑️)

### Audio Preview
- **Play Button**: Click ▶ Play to preview samples
- **Instant Playback**: Audio plays immediately
- **Volume**: Plays at configured gain level
- **Multiple Preview**: Can preview multiple samples simultaneously

### Sample Organization
- **Multiple Samples Per Zone**: Each zone can have multiple audio files
- **Random Selection**: Main app randomly selects from available samples
- **Automatic Management**: Samples are automatically organized by zone

## ⚙️ Zone Configuration

### Zone Status Management
- **Active/Inactive Toggle**: Control whether zones respond to taps
- **Visual Indicator**: Green dot = active, Red dot = inactive
- **Instant Updates**: Changes apply immediately to main app

### Advanced Zone Settings
Click "⚙️ Configure" on any zone for detailed settings:
- **Animation Parameters**: Fine-tune animation behavior
- **Audio Settings**: Adjust gain levels and timing
- **Trigger Behavior**: Customize interaction response

## 📊 Monitoring and Stats

### Dashboard Statistics
- **Active Zones**: Count of zones currently enabled
- **Total Samples**: Number of audio files across all zones
- **Storage Usage**: Audio file storage consumption (if available)

### Zone Health Check
- **Sample Status**: Verify all samples are properly uploaded
- **Animation Status**: Confirm animations are loading correctly
- **Configuration Issues**: Identify zones needing attention

## 🔄 Testing and Validation

### Test Main App Link
- **Quick Access**: Blue "🎯 Test Main App" button
- **Opens in New Tab**: Doesn't interrupt admin work
- **Live Testing**: Immediately test changes made in admin

### Testing Workflow
1. **Make changes** in admin panel (animations, samples, settings)
2. **Click test link** to open main app
3. **Tap zones** to verify changes
4. **Return to admin** to make further adjustments
5. **Repeat** until satisfied

### Validation Checklist
- ✅ All zones have animations assigned
- ✅ Audio samples are uploaded and playing
- ✅ Global scale setting is appropriate
- ✅ Only desired zones are active
- ✅ No broken or missing files

## 🛠️ Troubleshooting

### Upload Issues
**Files not uploading?**
- Check file size (under 10MB)
- Verify supported format (MP3, WAV, etc.)
- Ensure stable internet connection
- Try refreshing admin panel

**Upload stuck/failing?**
- Check Vercel Blob storage limits
- Verify BLOB_READ_WRITE_TOKEN environment variable
- Check browser console for errors
- Try smaller file sizes

### Audio Issues
**Samples not playing in preview?**
- Check browser audio permissions
- Verify file isn't corrupted
- Try different browser
- Check system audio settings

**Samples not playing in main app?**
- Confirm zone is active (green status)
- Verify samples uploaded successfully  
- Check main app console for errors
- Test with different audio format

### Configuration Issues
**Changes not applying?**
- Hard refresh main app (Ctrl+Shift+F5)
- Check database connection
- Verify environment variables
- Look for console errors

**Global scale not working?**
- Click Save button after adjusting slider
- Check database permissions
- Verify settings table exists
- Try different scale value

### Performance Issues
**Admin panel slow?**
- Close unused browser tabs
- Check network connection
- Clear browser cache
- Try different browser

**File operations timing out?**
- Reduce file sizes
- Upload files individually
- Check server resources
- Verify storage service status

## 🔒 Security Best Practices

### Password Management
- Use strong admin passwords (20+ characters)
- Include letters, numbers, and symbols
- Don't share admin credentials
- Change password periodically

### Access Control
- Only provide admin access to trusted users
- Log out when finished administering
- Use secure networks for admin access
- Monitor admin activity logs

### File Safety
- Scan audio files for malware before upload
- Only upload files from trusted sources
- Regularly backup audio samples
- Monitor storage usage and costs

## 📈 Advanced Tips

### Content Strategy
- **Varied Animations**: Use different animation types across zones
- **Audio Harmony**: Choose complementary audio samples
- **Balanced Experience**: Mix intense and subtle effects
- **Regular Updates**: Refresh content periodically

### Performance Optimization
- **File Compression**: Optimize audio file sizes
- **Strategic Scaling**: Use appropriate global scale for display size
- **Zone Management**: Disable unused zones to improve performance
- **Regular Cleanup**: Remove old or unused samples

### User Experience
- **Testing**: Regularly test from user perspective
- **Feedback**: Gather user feedback on configurations
- **Iteration**: Continuously refine and improve setup
- **Documentation**: Keep track of configuration decisions

---

**Questions? Check the [Troubleshooting Guide](./troubleshooting.md) or open a [GitHub Issue](https://github.com/MattKilmer/bapbapbapbapbap/issues).** 🛠️