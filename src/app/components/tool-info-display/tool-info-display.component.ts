import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToolInfo {
  name: string;
  description: string;
  url?: string;
  category: string;
  categoryColor: string;
  popularity: number;
  demoVideo?: string;
}

export interface CategoryInfo {
  name: string;
  description: string;
  color: string;
  tools: ToolInfo[];
}

@Component({
  selector: 'app-tool-info-display',
  template: `
    <!-- Single Tool Display -->
    <div class="tool-display" *ngIf="selectedTool && !selectedCategory">
      <div class="tool-header">
        <div class="tool-icon" [style.background]="selectedTool.categoryColor">
          🛠️
        </div>
        <div class="tool-details">
          <h3 class="tool-name">{{ selectedTool.name }}</h3>
          <p class="tool-category">{{ selectedTool.category }}</p>
          <p class="tool-description" *ngIf="selectedTool.description">
            {{ selectedTool.description }}
          </p>
        </div>
        <div class="tool-stats">
          <div class="popularity-badge">
            <span class="popularity-value">{{ selectedTool.popularity }}%</span>
            <span class="popularity-label">Popular</span>
          </div>
        </div>
      </div>

      <!-- Demo Video Section -->
      <div class="demo-video-section" *ngIf="selectedTool">
        <h4 class="demo-title">See {{ selectedTool.name }} in Action</h4>
        <div class="video-container" [class.highlight-pulse]="videoHighlight">
          
          <!-- Video Thumbnail/Placeholder -->
          <div class="video-placeholder" *ngIf="!isVideoPlaying" (click)="playDemoVideo()" [attr.data-tool]="selectedTool.name">
            <div class="video-play-button" [attr.aria-label]="'Play demo video for ' + selectedTool.name">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div class="video-overlay">
              <div class="video-info">
                <span class="video-duration">{{ getVideoInfo()?.duration || getVideoDuration() }}</span>
                <span class="video-quality">HD</span>
              </div>
            </div>
            <div class="video-thumbnail">
              <div class="thumbnail-gradient" [style.background]="getThumbnailGradient()"></div>
              <div class="thumbnail-content">
                <div class="thumbnail-icon" [style.background]="selectedTool.categoryColor">
                  {{ getToolIcon(selectedTool.name) }}
                </div>
                <div class="thumbnail-text">
                  <h5>{{ getVideoInfo()?.title || selectedTool.name + ' Demo' }}</h5>
                  <p>{{ getVideoInfo()?.description || 'Interactive walkthrough' }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Real Video Player -->
          <div class="video-player" *ngIf="isVideoPlaying">
            <video 
              #videoPlayer
              [src]="currentVideoUrl"
              controls
              autoplay
              preload="metadata"
              (loadedmetadata)="onVideoLoaded($event)"
              (timeupdate)="onTimeUpdate($event)"
              (ended)="onVideoEnded()"
              (error)="onVideoError($event)"
              (play)="onPlay()"
              (pause)="onPause()"
              class="demo-video"
              [attr.aria-label]="'Demo video for ' + selectedTool.name"
            >
              <source [src]="currentVideoUrl" type="video/mp4">
              <p>Your browser doesn't support HTML5 video. Here's a <a [href]="currentVideoUrl">link to the video</a> instead.</p>
            </video>
            
            <!-- Custom Video Controls Overlay -->
            <div class="video-controls-overlay" [class.visible]="showControls">
              <div class="video-progress-container" (click)="seekVideo($event)">
                <div class="video-progress">
                  <div class="progress-bar" [style.width.%]="videoProgress"></div>
                  <div class="progress-handle" [style.left.%]="videoProgress"></div>
                </div>
              </div>
              
              <div class="video-controls">
                <button class="control-btn play-pause" (click)="togglePlayPause()" [attr.aria-label]="isPlaying ? 'Pause video' : 'Play video'">
                  <svg *ngIf="!isPlaying" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg *ngIf="isPlaying" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                </button>
                
                <div class="volume-control">
                  <button class="control-btn volume-btn" (click)="toggleMute()" [attr.aria-label]="isMuted ? 'Unmute' : 'Mute'">
                    <svg *ngIf="!isMuted && volume > 0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    <svg *ngIf="!isMuted && volume <= 0.5 && volume > 0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                    </svg>
                    <svg *ngIf="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  </button>
                  <input 
                    type="range" 
                    class="volume-slider" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    [value]="volume"
                    (input)="setVolume($event)"
                    [attr.aria-label]="'Volume: ' + Math.round(volume * 100) + '%'"
                  />
                </div>
                
                <span class="video-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                
                <div class="playback-speed">
                  <select class="speed-selector" (change)="setPlaybackSpeed($event)" [value]="playbackSpeed">
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
                
                <button class="control-btn" (click)="toggleFullscreen()" aria-label="Toggle fullscreen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                </button>
                
                <button class="control-btn close-btn" (click)="closeVideo()" aria-label="Close video">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Loading Indicator -->
            <div class="video-loading" *ngIf="isVideoLoading">
              <div class="loading-spinner"></div>
              <span>Loading video...</span>
            </div>
          </div>
        </div>
        
        <p class="demo-description">
          {{ getVideoInfo()?.description || 'Watch how ' + selectedTool.name + ' can streamline your workflow and boost productivity.' }}
          <span *ngIf="isVideoPlaying && isPlaying" class="video-status"> • Now playing</span>
          <span *ngIf="isVideoPlaying && !isPlaying" class="video-status paused"> • Paused</span>
        </p>
      </div>
      
      <div class="tool-actions">
        <button class="action-btn primary" (click)="onVisitTool()" *ngIf="selectedTool.url">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Visit {{ getDomain() }}
        </button>
        
        <button class="action-btn secondary" (click)="playDemoVideo()" [disabled]="isVideoPlaying">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5,3 19,12 5,21"></polygon>
          </svg>
          {{ isVideoPlaying ? 'Playing...' : 'Watch Demo' }}
        </button>
        
        <button class="action-btn secondary" (click)="onShareTool()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share Tool
        </button>
      </div>
    </div>

    <!-- Category Tools Display -->
    <div class="category-display" *ngIf="selectedCategory">
      <div class="category-header">
        <div class="category-icon" [style.background]="selectedCategory.color">
          {{ getCategoryIcon(selectedCategory.name) }}
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ selectedCategory.name }}</h3>
          <p class="category-description">{{ selectedCategory.description }}</p>
          <span class="tools-count">{{ selectedCategory.tools.length }} tools available</span>
        </div>
      </div>

      <div class="tools-grid">
        <div class="tool-card" *ngFor="let tool of selectedCategory.tools" (click)="onToolSelect(tool)">
          <div class="tool-card-header">
            <div class="tool-card-icon" [style.background]="tool.categoryColor">
              {{ getToolIcon(tool.name) }}
            </div>
            <div class="tool-card-info">
              <h4 class="tool-card-name">{{ tool.name }}</h4>
              <p class="tool-card-description">{{ tool.description }}</p>
            </div>
            <div class="tool-card-popularity">
              {{ tool.popularity }}%
            </div>
          </div>
          
          <div class="tool-card-actions">
            <button class="tool-card-btn" (click)="visitToolUrl(tool.url); $event.stopPropagation()" *ngIf="tool.url">
              Visit Tool
            </button>
            <button class="tool-card-btn secondary" (click)="shareTool.emit(tool); $event.stopPropagation()">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tool-display, .category-display {
      background: var(--display-bg);
      border-radius: 16px;
      padding: 32px;
      border: 1px solid var(--display-border);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      margin-top: 32px;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Single Tool Display */
    .tool-header {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 24px;
    }

    .tool-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .tool-details {
      flex: 1;
      min-width: 0;
    }

    .tool-name {
      font-size: 28px;
      font-weight: 700;
      color: var(--tool-name);
      margin: 0 0 8px 0;
    }

    .tool-category {
      font-size: 16px;
      color: var(--tool-category);
      margin: 0 0 12px 0;
      font-weight: 500;
    }

    .tool-description {
      font-size: 16px;
      color: var(--tool-description);
      line-height: 1.6;
      margin: 0;
    }

    .tool-stats {
      flex-shrink: 0;
    }

    .popularity-badge {
      background: var(--badge-bg);
      padding: 12px 16px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid var(--badge-border);
    }

    .popularity-value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: var(--badge-value);
      margin-bottom: 4px;
    }

    .popularity-label {
      font-size: 12px;
      color: var(--badge-label);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    /* Demo Video Section */
    .demo-video-section {
      margin: 32px 0;
      padding: 24px;
      background: var(--demo-section-bg);
      border-radius: 16px;
      border: 1px solid var(--demo-section-border);
      scroll-margin-top: 100px;
      transition: all 0.3s ease;
    }

    .demo-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--demo-title);
      margin: 0 0 20px 0;
      text-align: center;
    }

    .video-container {
      position: relative;
      width: 100%;
      max-width: 700px;
      margin: 0 auto 16px;
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
    }

    .video-container.highlight-pulse {
      animation: videoPulse 2s ease-in-out;
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
    }

    @keyframes videoPulse {
      0% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      }
      50% {
        transform: scale(1.02);
        box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      }
    }

    /* Video Placeholder */
    .video-placeholder {
      position: relative;
      width: 100%;
      height: 350px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    }

    .video-placeholder:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }

    .video-thumbnail {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thumbnail-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.9;
    }

    .thumbnail-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 20px;
      color: white;
      text-align: left;
    }

    .thumbnail-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .thumbnail-text h5 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 4px 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .thumbnail-text p {
      font-size: 14px;
      margin: 0;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .video-play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .video-play-button:hover {
      transform: translate(-50%, -50%) scale(1.1);
      background: rgba(255, 255, 255, 1);
    }

    .video-play-button svg {
      width: 32px;
      height: 32px;
      color: #3b82f6;
      margin-left: 4px;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
      z-index: 1;
    }

    .video-info {
      position: absolute;
      bottom: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
      z-index: 3;
    }

    .video-duration,
    .video-quality {
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Real Video Player */
    .video-player {
      position: relative;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background: #000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .demo-video {
      width: 100%;
      height: auto;
      max-height: 450px;
      display: block;
      border-radius: 12px;
    }

    /* Custom Video Controls */
    .video-controls-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 10;
    }

    .video-player:hover .video-controls-overlay,
    .video-controls-overlay.visible {
      opacity: 1;
    }

    .video-progress-container {
      width: 100%;
      margin-bottom: 12px;
      cursor: pointer;
    }

    .video-progress {
      position: relative;
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: #3b82f6;
      border-radius: 3px;
      transition: width 0.1s ease;
    }

    .progress-handle {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .video-progress-container:hover .progress-handle {
      opacity: 1;
    }

    .video-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      color: white;
    }

    .control-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .control-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .control-btn svg {
      width: 18px;
      height: 18px;
    }

    .play-pause svg {
      width: 20px;
      height: 20px;
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-slider {
      width: 60px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border-radius: 50%;
      cursor: pointer;
    }

    .video-time {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-left: auto;
      white-space: nowrap;
    }

    .playback-speed {
      margin-left: 8px;
    }

    .speed-selector {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
    }

    .close-btn {
      margin-left: 8px;
      background: rgba(239, 68, 68, 0.8);
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 1);
    }

    /* Video Loading */
    .video-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: white;
      z-index: 5;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .demo-description {
      text-align: center;
      color: var(--demo-description);
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .video-status {
      color: var(--video-status-color);
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    .video-status.paused {
      color: var(--video-status-paused);
      animation: none;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    .tool-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 32px;
    }

    .action-btn {
      padding: 16px 24px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .action-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .action-btn svg {
      width: 18px;
      height: 18px;
    }

    .action-btn.primary {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
    }

    .action-btn.primary:hover:not(:disabled) {
      background: var(--btn-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
    }

    .action-btn.secondary {
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-text);
      border: 1px solid var(--btn-secondary-border);
    }

    .action-btn.secondary:hover:not(:disabled) {
      background: var(--btn-secondary-hover);
      transform: translateY(-2px);
    }

    /* Category Display */
    .category-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--category-border);
    }

    .category-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      font-size: 28px;
      font-weight: 700;
      color: var(--category-name);
      margin: 0 0 8px 0;
    }

    .category-description {
      font-size: 16px;
      color: var(--category-description);
      line-height: 1.6;
      margin: 0 0 8px 0;
    }

    .tools-count {
      font-size: 14px;
      color: var(--tools-count);
      font-weight: 500;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .tool-card {
      background: var(--tool-card-bg);
      border: 1px solid var(--tool-card-border);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tool-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
      border-color: var(--tool-card-hover-border);
    }

    .tool-card-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }

    .tool-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      flex-shrink: 0;
    }

    .tool-card-info {
      flex: 1;
      min-width: 0;
    }

    .tool-card-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--tool-card-name);
      margin: 0 0 8px 0;
    }

    .tool-card-description {
      font-size: 14px;
      color: var(--tool-card-description);
      line-height: 1.4;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tool-card-popularity {
      font-size: 14px;
      font-weight: 600;
      color: var(--tool-card-popularity);
      background: var(--popularity-bg);
      padding: 4px 8px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .tool-card-actions {
      display: flex;
      gap: 8px;
    }

    .tool-card-btn {
      flex: 1;
      padding: 8px 16px;
      border: 1px solid var(--tool-card-btn-border);
      background: var(--tool-card-btn-bg);
      color: var(--tool-card-btn-text);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tool-card-btn:hover {
      background: var(--tool-card-btn-hover);
    }

    .tool-card-btn.secondary {
      background: var(--tool-card-btn-secondary-bg);
      color: var(--tool-card-btn-secondary-text);
    }

    .tool-card-btn.secondary:hover {
      background: var(--tool-card-btn-secondary-hover);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .tool-display, .category-display {
        padding: 20px;
      }

      .tool-header, .category-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .tool-actions {
        justify-content: center;
      }

      .tools-grid {
        grid-template-columns: 1fr;
      }

      .tool-card-header {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }

      .tool-card-actions {
        flex-direction: column;
      }

      .demo-video-section {
        padding: 16px;
      }

      .video-placeholder {
        height: 250px;
      }

      .thumbnail-content {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .video-play-button {
        width: 60px;
        height: 60px;
      }

      .video-play-button svg {
        width: 24px;
        height: 24px;
      }

      .video-controls {
        flex-wrap: wrap;
        gap: 8px;
      }

      .volume-control {
        order: 1;
        width: 100%;
        justify-content: center;
      }

      .video-time {
        margin-left: 0;
        order: 2;
      }
    }

    /* Light theme */
    :host-context([data-theme="light"]) {
      --display-bg: rgba(255, 255, 255, 0.95);
      --display-border: rgba(226, 232, 240, 0.8);
      --tool-name: #1e293b;
      --tool-category: #64748b;
      --tool-description: #475569;
      --badge-bg: rgba(59, 130, 246, 0.1);
      --badge-border: rgba(59, 130, 246, 0.2);
      --badge-value: #3b82f6;
      --badge-label: #64748b;
      --btn-primary-bg: #3b82f6;
      --btn-primary-text: white;
      --btn-primary-hover: #2563eb;
      --btn-secondary-bg: #f8fafc;
      --btn-secondary-text: #475569;
      --btn-secondary-border: #e2e8f0;
      --btn-secondary-hover: #f1f5f9;
      --category-border: #e2e8f0;
      --category-name: #1e293b;
      --category-description: #475569;
      --tools-count: #64748b;
      --tool-card-bg: rgba(255, 255, 255, 0.8);
      --tool-card-border: #e2e8f0;
      --tool-card-hover-border: #3b82f6;
      --tool-card-name: #1e293b;
      --tool-card-description: #64748b;
      --tool-card-popularity: #3b82f6;
      --popularity-bg: rgba(59, 130, 246, 0.1);
      --tool-card-btn-bg: #f8fafc;
      --tool-card-btn-text: #475569;
      --tool-card-btn-border: #e2e8f0;
      --tool-card-btn-hover: #f1f5f9;
      --tool-card-btn-secondary-bg: transparent;
      --tool-card-btn-secondary-text: #64748b;
      --tool-card-btn-secondary-hover: #f8fafc;
      --demo-section-bg: rgba(248, 250, 252, 0.8);
      --demo-section-border: #e2e8f0;
      --demo-title: #1e293b;
      --demo-description: #64748b;
      --video-status-color: #10b981;
      --video-status-paused: #f59e0b;
    }

    /* Dark theme */
    :host-context([data-theme="dark"]) {
      --display-bg: rgba(30, 41, 59, 0.95);
      --display-border: rgba(51, 65, 85, 0.8);
      --tool-name: #f1f5f9;
      --tool-category: #94a3b8;
      --tool-description: #cbd5e1;
      --badge-bg: rgba(96, 165, 250, 0.15);
      --badge-border: rgba(96, 165, 250, 0.3);
      --badge-value: #60a5fa;
      --badge-label: #94a3b8;
      --btn-primary-bg: #3b82f6;
      --btn-primary-text: white;
      --btn-primary-hover: #60a5fa;
      --btn-secondary-bg: #475569;
      --btn-secondary-text: #cbd5e1;
      --btn-secondary-border: #64748b;
      --btn-secondary-hover: #64748b;
      --category-border: #475569;
      --category-name: #f1f5f9;
      --category-description: #cbd5e1;
      --tools-count: #94a3b8;
      --tool-card-bg: rgba(51, 65, 85, 0.8);
      --tool-card-border: #475569;
      --tool-card-hover-border: #60a5fa;
      --tool-card-name: #f1f5f9;
      --tool-card-description: #94a3b8;
      --tool-card-popularity: #60a5fa;
      --popularity-bg: rgba(96, 165, 250, 0.15);
      --tool-card-btn-bg: #64748b;
      --tool-card-btn-text: #f1f5f9;
      --tool-card-btn-border: #64748b;
      --tool-card-btn-hover: #475569;
      --tool-card-btn-secondary-bg: transparent;
      --tool-card-btn-secondary-text: #94a3b8;
      --tool-card-btn-secondary-hover: #475569;
      --demo-section-bg: rgba(51, 65, 85, 0.8);
      --demo-section-border: #475569;
      --demo-title: #f1f5f9;
      --demo-description: #94a3b8;
      --video-status-color: #34d399;
      --video-status-paused: #fbbf24;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ToolInfoDisplayComponent implements OnInit {
  @Input() selectedTool: ToolInfo | null = null;
  @Input() selectedCategory: CategoryInfo | null = null;
  @Output() visitTool = new EventEmitter<string>();
  @Output() shareTool = new EventEmitter<ToolInfo>();
  @Output() toolSelect = new EventEmitter<ToolInfo>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  // Video player state
  isVideoPlaying = false;
  isVideoLoading = false;
  currentVideoUrl = '';
  showControls = false;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  videoProgress = 0;
  volume = 1;
  isMuted = false;
  playbackSpeed = 1;
  videoHighlight = false;
  
  // Real AI tool demo videos database
  private videoData: any = null;
  private baseUrl = 'https://ai-server-859193427822.asia-south1.run.app/api';

  ngOnInit() {
    // Load video database from server
    this.loadVideoDatabase();
    
    // Auto-hide controls after 3 seconds of inactivity
    let controlsTimeout: any;
    
    document.addEventListener('mousemove', () => {
      if (this.isVideoPlaying) {
        this.showControls = true;
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
          this.showControls = false;
        }, 3000);
      }
    });
  }

  private loadVideoDatabase() {
    fetch(`${this.baseUrl}/videos`)
      .then(response => response.json())
      .then(data => {
        this.videoData = data;
      })
      .catch(error => {
        console.error('Error loading video database:', error);
        // Fallback to default video
        this.videoData = {
          'default': {
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '9:56',
            title: 'AI Tool Demo',
            description: 'Discover the power of artificial intelligence'
          }
        };
      });
  }

  private async getVideoForTool(toolName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/by-name/${encodeURIComponent(toolName)}`);
      const data = await response.json();
      return data.video;
    } catch (error) {
      console.error('Error fetching video for tool:', toolName, error);
      return this.videoData?.['default'] || {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '9:56',
        title: 'AI Tool Demo',
        description: 'Discover the power of artificial intelligence'
      };
    }
  }

  getVideoDuration(): string {
    if (!this.selectedTool || !this.videoData) return '2:30';
    const toolKey = this.selectedTool.name.toLowerCase().replace(/\s+/g, '-');
    const video = this.videoData[toolKey] || this.videoData['default'];
    return video?.duration || '2:30';
  }

  async playDemoVideo() {
    if (!this.selectedTool || this.isVideoPlaying) return;
    
    // Get video data for the selected tool
    const videoData = await this.getVideoForTool(this.selectedTool.name);
    this.currentVideoUrl = videoData.url;
    
    // Show video player
    this.isVideoPlaying = true;
    this.isVideoLoading = true;
    this.showControls = true;
    
    // Add highlight effect
    this.videoHighlight = true;
    setTimeout(() => {
      this.videoHighlight = false;
    }, 2000);
    
    // Scroll to video section
    setTimeout(() => {
      const demoSection = document.querySelector('.demo-video-section');
      if (demoSection) {
        demoSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  }

  onVideoLoaded(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.duration = video.duration;
    this.isVideoLoading = false;
    this.isPlaying = true;
    
    // Set initial volume
    video.volume = this.volume;
    video.playbackRate = this.playbackSpeed;
  }

  onTimeUpdate(event: Event) {
    const video = event.target as HTMLVideoElement;
    this.currentTime = video.currentTime;
    this.videoProgress = (this.currentTime / this.duration) * 100;
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.videoProgress = 100;
    this.showControls = true;
    
    // Auto-close video after 5 seconds
    setTimeout(() => {
      if (!this.isPlaying) {
        this.closeVideo();
      }
    }, 5000);
  }

  onVideoError(event: any) {
    console.error('Video loading error:', event);
    this.isVideoLoading = false;
    
    // Try fallback video
    if (this.videoData && this.currentVideoUrl !== this.videoData['default'].url) {
      this.currentVideoUrl = this.videoData['default'].url;
    }
  }

  togglePlayPause() {
    if (!this.videoPlayer) return;
    
    const video = this.videoPlayer.nativeElement;
    if (this.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }

  seekVideo(event: MouseEvent) {
    if (!this.videoPlayer || !this.duration) return;
    
    const progressContainer = event.currentTarget as HTMLElement;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * this.duration;
    
    this.videoPlayer.nativeElement.currentTime = newTime;
  }

  toggleMute() {
    if (!this.videoPlayer) return;
    
    const video = this.videoPlayer.nativeElement;
    this.isMuted = !this.isMuted;
    video.muted = this.isMuted;
  }

  setVolume(event: Event) {
    if (!this.videoPlayer) return;
    
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    this.videoPlayer.nativeElement.volume = this.volume;
    
    if (this.volume === 0) {
      this.isMuted = true;
      this.videoPlayer.nativeElement.muted = true;
    } else if (this.isMuted) {
      this.isMuted = false;
      this.videoPlayer.nativeElement.muted = false;
    }
  }

  setPlaybackSpeed(event: Event) {
    if (!this.videoPlayer) return;
    
    const select = event.target as HTMLSelectElement;
    this.playbackSpeed = parseFloat(select.value);
    this.videoPlayer.nativeElement.playbackRate = this.playbackSpeed;
  }

  toggleFullscreen() {
    if (!this.videoPlayer) return;
    
    const video = this.videoPlayer.nativeElement;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(console.error);
    }
  }

  closeVideo() {
    this.isVideoPlaying = false;
    this.isPlaying = false;
    this.currentTime = 0;
    this.videoProgress = 0;
    this.showControls = false;
    this.currentVideoUrl = '';
    this.isVideoLoading = false;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onVisitTool() {
    if (this.selectedTool?.url) {
      this.visitTool.emit(this.selectedTool.url);
    }
  }

  onShareTool() {
    if (this.selectedTool) {
      this.shareTool.emit(this.selectedTool);
    }
  }

  onToolSelect(tool: ToolInfo) {
    this.toolSelect.emit(tool);
  }

  visitToolUrl(url?: string) {
    if (url) {
      this.visitTool.emit(url);
    }
  }

  getDomain(): string {
    if (!this.selectedTool?.url) return '';
    try {
      const url = new URL(this.selectedTool.url);
      return url.hostname.replace('www.', '');
    } catch {
      return 'Website';
    }
  }

  getCategoryIcon(categoryName: string): string {
    const icons: Record<string, string> = {
      'Text Generation': '✍️',
      'Image Generation': '🎨',
      'Code Generation': '💻',
      'Audio Processing': '🎵',
      'Video Generation': '🎬',
      'Data Analysis': '📊',
      'Design Tools': '🎯',
      'Productivity': '⚡',
      'Translation': '🌐',
      'Customer Support': '💬',
      'Marketing': '📢',
      'Research': '🔬',
      'Education': '📚',
      'Healthcare': '🏥',
      'Finance': '💰',
      'Legal Tech': '⚖️'
    };
    return icons[categoryName] || '🔧';
  }

  getToolIcon(toolName: string): string {
    const icons: Record<string, string> = {
      'ChatGPT': '🤖',
      'DALL·E': '🎨',
      'GitHub Copilot': '👨‍💻',
      'Midjourney': '🖼️',
      'Claude': '🧠',
      'Stable Diffusion': '🎭',
      'ElevenLabs': '🎙️',
      'Runway ML': '🎬',
      'Gemini': '💎',
      'Jasper': '✍️',
      'Cursor': '⌨️',
      'Synthesia': '👤',
      'Mubert': '🎵',
      'Canva AI': '🎨',
      'Notion AI': '📝'
    };
    return icons[toolName] || '🛠️';
  }

  getThumbnailGradient(): string {
    if (!this.selectedTool) return 'linear-gradient(135deg, #3b82f6, #1e40af)';
    const color = this.selectedTool.categoryColor;
    return `linear-gradient(135deg, ${color}, ${this.darkenColor(color, 20)})`;
  }

  private darkenColor(color: string, percent: number): string {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const factor = (100 - percent) / 100;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  getVideoInfo(): any {
    if (!this.selectedTool || !this.videoData) return null;
    const toolKey = this.selectedTool.name.toLowerCase().replace(/\s+/g, '-');
    return this.videoData[toolKey] || this.videoData['default'];
  }
}