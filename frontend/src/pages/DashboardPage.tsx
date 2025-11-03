
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import videoService from '../services/videoService';
import { 
  Container, Box, Button, Typography, TextField, FormGroup, FormControlLabel, 
  Checkbox, AppBar, Toolbar, IconButton, CircularProgress, Alert, Paper 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const platforms = ['YouTube', 'TikTok', 'Instagram', 'Facebook'];

const DashboardPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || selectedPlatforms.length === 0 || !token) {
      setStatus({ type: 'error', message: 'Video file and at least one platform are required.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('platforms', JSON.stringify(selectedPlatforms));

    try {
      const response = await videoService.uploadVideo(formData, token);
      setStatus({ type: 'success', message: response.data.message });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Multi-Post Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Upload New Video
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Video Title"
              fullWidth
              margin="normal"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <TextField
              label="Video Description"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Select Platforms:</Typography>
            <FormGroup row sx={{ mb: 2 }}>
              {platforms.map(p => (
                <FormControlLabel
                  key={p}
                  control={<Checkbox checked={selectedPlatforms.includes(p)} onChange={() => handlePlatformChange(p)} />}
                  label={p}
                />
              ))}
            </FormGroup>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Choose Video File
              <input type="file" hidden accept="video/*" onChange={handleFileChange} />
            </Button>
            {videoFile && <Typography sx={{ display: 'inline', ml: 2 }}>{videoFile.name}</Typography>}
            <Box sx={{ mt: 3, position: 'relative' }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large" 
                disabled={isLoading || !videoFile || selectedPlatforms.length === 0}
                fullWidth
              >
                Upload Video
              </Button>
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
            {status && <Alert severity={status.type} sx={{ mt: 2 }}>{status.message}</Alert>}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;
