#!/bin/bash

# JFlix Content Update Script
# This script makes it easy to update JFlix content manually or set up automatic updates

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}JFlix Content Update Tool${NC}"
echo "============================="

function update_content() {
  echo -e "${YELLOW}Updating JFlix content...${NC}"
  node "$SCRIPT_DIR/updateContent.js"
  
  if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Content updated successfully!${NC}"
    echo -e "Content file: $PROJECT_DIR/content.json"
  else
    echo -e "\n${RED}❌ Error updating content${NC}"
    exit 1
  fi
}

function start_auto_update() {
  echo -e "${YELLOW}Starting JFlix auto-update service...${NC}"
  
  # Check if the auto-update script exists
  if [ ! -f "$SCRIPT_DIR/autoUpdate.js" ]; then
    echo -e "${RED}❌ Auto-update script not found!${NC}"
    exit 1
  fi
  
  # Make both scripts executable
  chmod +x "$SCRIPT_DIR/updateContent.js"
  chmod +x "$SCRIPT_DIR/autoUpdate.js"
  
  # Start the auto-update service
  node "$SCRIPT_DIR/autoUpdate.js"
}

function setup_cron_job() {
  echo -e "${YELLOW}Setting up scheduled updates with cron...${NC}"
  
  # Make the update script executable
  chmod +x "$SCRIPT_DIR/updateContent.js"
  
  # Create a temporary file for the cron job
  TEMP_CRON=$(mktemp)
  
  # Export current crontab
  crontab -l > "$TEMP_CRON" 2>/dev/null || echo "" > "$TEMP_CRON"
  
  # Check if the job already exists
  if grep -q "$SCRIPT_DIR/updateContent.js" "$TEMP_CRON"; then
    echo -e "${YELLOW}⚠️ Cron job already exists. Skipping...${NC}"
  else
    # Add the new job to run twice daily (midnight and noon)
    echo "0 0,12 * * * /usr/bin/node $SCRIPT_DIR/updateContent.js >> $SCRIPT_DIR/cron-update.log 2>&1" >> "$TEMP_CRON"
    
    # Install the updated crontab
    crontab "$TEMP_CRON"
    
    echo -e "${GREEN}✅ Cron job added successfully!${NC}"
    echo "JFlix content will update automatically at midnight and noon."
  fi
  
  # Clean up
  rm "$TEMP_CRON"
}

# Check command line arguments
case "$1" in
  "update")
    update_content
    ;;
  "auto")
    start_auto_update
    ;;
  "cron")
    setup_cron_job
    ;;
  *)
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  update    Update JFlix content immediately"
    echo "  auto      Start the auto-update service (runs in foreground)"
    echo "  cron      Set up scheduled updates using cron (runs in background)"
    echo ""
    echo "Example:"
    echo "  $0 update    # Update content now"
    echo "  $0 cron      # Set up automatic updates with cron"
    ;;
esac

exit 0
