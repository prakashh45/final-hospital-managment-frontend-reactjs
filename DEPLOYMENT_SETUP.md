# React to AWS EC2 CI/CD Deployment Guide

This guide explains how to set up automated deployments of your React/Vite application to AWS EC2 using GitHub Actions.

## Prerequisites

- AWS EC2 instance running Ubuntu (20.04 LTS or later)
- Node.js 20 installed on your local machine
- GitHub repository with push access
- SSH access to your EC2 instance

## Step 1: Prepare EC2 Server

### SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

### Install NGINX:
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure NGINX for React SPA:
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the server block with:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;
    root /var/www/html;
    index index.html;

    # React SPA routing - send all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Restart NGINX:
```bash
sudo systemctl restart nginx
```

### Create deployment directory:
```bash
sudo mkdir -p /var/www/html
sudo chown -R ubuntu:ubuntu /var/www/html
sudo chmod -R 755 /var/www/html
```

## Step 2: Generate SSH Key Pair

### On your local machine, generate an SSH key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
```

### Add public key to EC2:
```bash
cat ~/.ssh/github-actions.pub | ssh -i your-key.pem ubuntu@your-ec2-ip "cat >> ~/.ssh/authorized_keys"
```

### Get the private key content (you'll need this for GitHub):
```bash
cat ~/.ssh/github-actions
```

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Create the following secrets:

| Secret Name | Value |
|------------|-------|
| `EC2_HOST` | Your EC2 public IP or domain (e.g., `203.0.113.45` or `api.example.com`) |
| `EC2_USERNAME` | `ubuntu` (default for Ubuntu AMI) |
| `EC2_SSH_KEY` | Your private SSH key (content of `~/.ssh/github-actions`) |
| `VITE_API_URL` | Your backend API URL (optional, if needed) |

## Step 4: Configure package.json

Ensure your `package.json` has build script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Step 5: Test the Pipeline

1. Push code to `main` branch:
```bash
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

2. Go to GitHub repository → **Actions** tab
3. Watch the workflow execute
4. Check deployment status

## Deployment Workflow

```
Code Push → GitHub Actions Start
    ↓
Install Dependencies (npm ci)
    ↓
Build React App (npm run build)
    ↓
SSH into EC2
    ↓
Upload dist/ folder
    ↓
Replace old deployment
    ↓
Restart NGINX
    ↓
Verify site is online
    ↓
✓ Deployment Complete
```

## Troubleshooting

### Build Fails
**Error:** `npm ERR! code ERESOLVE`
- Solution: Clear npm cache: `npm cache clean --force`

### SSH Connection Timeout
**Error:** `ssh: connect to host ... port 22: Connection timed out`
- Solution: Check EC2 security group allows port 22 (SSH) inbound

### Permission Denied
**Error:** `sudo: no password required`
- Solution: Ensure SSH key is properly configured in EC2

### NGINX Returns 404
**Error:** React routes return 404
- Solution: Update NGINX config to use `try_files $uri $uri/ /index.html;`

### Dist Folder Not Found
**Error:** `Error: dist folder not found after build`
- Solution: Ensure `npm run build` completes without errors

## Manual Deployment (Fallback)

If GitHub Actions fails, deploy manually:

```bash
# Build locally
npm run build

# SCP to EC2
scp -i ~/.ssh/github-actions -r dist/* ubuntu@your-ec2-ip:/tmp/react-app

# SSH and deploy
ssh -i ~/.ssh/github-actions ubuntu@your-ec2-ip << 'EOF'
sudo cp -r /tmp/react-app/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo systemctl restart nginx
rm -rf /tmp/react-app
EOF
```

## Security Checklist

- [ ] EC2 security group restricts SSH to your IP
- [ ] GitHub secrets never exposed in logs
- [ ] SSH key has appropriate permissions (600)
- [ ] NGINX runs with restricted permissions
- [ ] Regular backups of deployments (automated in pipeline)
- [ ] HTTPS configured (use AWS Certificate Manager + ALB)
- [ ] Environment variables in GitHub secrets

## Advanced Setup (Optional)

### Enable HTTPS with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Monitor Deployments
Add Slack notification to workflow (add to `.github/workflows/deploy.yml`):
```yaml
- name: Slack Notification
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Deployment ${{ job.status }}: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
      }
```

## Next Steps

1. Push your code to `main` branch
2. Monitor the GitHub Actions workflow
3. Verify the deployment on your EC2 instance
4. Set up monitoring and alerts
5. Configure backup strategy

For more help, check the workflow logs in GitHub Actions or review the `deploy.yml` file.
