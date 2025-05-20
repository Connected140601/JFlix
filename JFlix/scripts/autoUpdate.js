#!/usr/bin/env node

/**
 * JFlix Auto-Update Script
 * 
 * This script automatically updates JFlix content on a schedule to ensure
 * the website always has the latest movies, TV shows, Korean TV, and anime.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  // How often to update content (in milliseconds)
  updateInterval: 12 * 60 * 60 * 1000, // 12 hours
  
  // Path to the update script
  updateScriptPath: path.join(__dirname, 'updateContent.js'),
  
  // Path to the content file
  contentFilePath: path.join(__dirname, '..', 'content.json'),
  
  // Log file path
  logFilePath: path.join(__dirname, 'update-logs.txt'),
  
  // Maximum number of log entries to keep
  maxLogEntries: 100,
};

/**
 * Logs a message to both console and the log file
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  // Log to console
  console.log(logMessage);
  
  // Log to file
  try {
    // Read existing logs
    let logs = [];
    if (fs.existsSync(CONFIG.logFilePath)) {
      logs = fs.readFileSync(CONFIG.logFilePath, 'utf8').split('\n').filter(Boolean);
    }
    
    // Add new log
    logs.push(logMessage);
    
    // Keep only the most recent logs
    if (logs.length > CONFIG.maxLogEntries) {
      logs = logs.slice(logs.length - CONFIG.maxLogEntries);
    }
    
    // Write back to file
    fs.writeFileSync(CONFIG.logFilePath, logs.join('\n') + '\n');
  } catch (error) {
    console.error(`Error writing to log file: ${error.message}`);
  }
}

/**
 * Runs the update script
 */
function runUpdate() {
  log('Starting content update...');
  
  // Check if the update script exists
  if (!fs.existsSync(CONFIG.updateScriptPath)) {
    log(`❌ Error: Update script not found at ${CONFIG.updateScriptPath}`);
    return;
  }
  
  // Run the update script
  exec(`node ${CONFIG.updateScriptPath}`, (error, stdout, stderr) => {
    if (error) {
      log(`❌ Error running update script: ${error.message}`);
      if (stderr) log(`Error output: ${stderr}`);
      return;
    }
    
    if (stderr) {
      log(`⚠️ Warning output from update script: ${stderr}`);
    }
    
    log(`✅ Update completed successfully`);
    log(`Output: ${stdout.trim()}`);
    
    // Check if content file was updated
    if (fs.existsSync(CONFIG.contentFilePath)) {
      const stats = fs.statSync(CONFIG.contentFilePath);
      log(`📊 Content file last modified: ${stats.mtime.toLocaleString()}`);
      log(`📊 Content file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    } else {
      log(`❌ Warning: Content file not found after update`);
    }
  });
}

/**
 * Main function to start the auto-update process
 */
function startAutoUpdate() {
  log('🚀 JFlix Auto-Update Service Started');
  log(`📅 Update interval set to ${CONFIG.updateInterval / (60 * 60 * 1000)} hours`);
  
  // Run update immediately on startup
  runUpdate();
  
  // Schedule regular updates
  setInterval(runUpdate, CONFIG.updateInterval);
  
  // Also run updates at specific times (e.g., midnight and noon)
  scheduleSpecificTimeUpdates();
}

/**
 * Schedules updates at specific times of day
 */
function scheduleSpecificTimeUpdates() {
  // Function to calculate ms until next specific time
  function msUntilTime(hour, minute = 0) {
    const now = new Date();
    const target = new Date(now);
    target.setHours(hour, minute, 0, 0);
    
    if (target <= now) {
      // If the target time has already passed today, schedule for tomorrow
      target.setDate(target.getDate() + 1);
    }
    
    return target - now;
  }
  
  // Schedule update at midnight (00:00)
  const msUntilMidnight = msUntilTime(0, 0);
  setTimeout(() => {
    log('Running scheduled midnight update');
    runUpdate();
    // Schedule the next midnight update
    setInterval(() => {
      log('Running scheduled midnight update');
      runUpdate();
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }, msUntilMidnight);
  
  // Schedule update at noon (12:00)
  const msUntilNoon = msUntilTime(12, 0);
  setTimeout(() => {
    log('Running scheduled noon update');
    runUpdate();
    // Schedule the next noon update
    setInterval(() => {
      log('Running scheduled noon update');
      runUpdate();
    }, 24 * 60 * 60 * 1000); // Every 24 hours
  }, msUntilNoon);
  
  log(`📅 Scheduled specific updates: Next midnight update in ${(msUntilMidnight / (60 * 60 * 1000)).toFixed(2)} hours, next noon update in ${(msUntilNoon / (60 * 60 * 1000)).toFixed(2)} hours`);
}

// Start the auto-update process
startAutoUpdate();
