import {AlignText} from '../../../src/constants.js';

export const props = [
   {
    name: 'Slot Bros',
    radius: 0.85,
    itemLabelRadius: 0.90,
    itemLabelRadiusMax: 0.35,
    itemLabelRotation: 180,
    itemLabelAlign: AlignText.left,
    // itemLabelColors: ['#FFD700', '#FFFFFF', '#0000FF', '#FF4500'], 
    itemLabelColors: ['#000000'], 
    itemLabelBaselineOffset: -0.07,
    itemLabelFont: 'Amatic SC',
    itemLabelFontSizeMax: 55,
    itemBackgroundColors: ['#FF4500', '#FFD700', '#FFFFFF', '#0000FF'], 
    rotationSpeedMax: 500,
    rotationResistance: -100,
    lineWidth: 1,
    lineColor: '#000', // Black color for contrast
    overlayImage: './img/example-3-overlay.svg',
    items: [
      {
        label: 'BEN',
        weight: 1.0,
        backgroundColor: '#FF4500', // Red for Ben
      },
      {
        label: 'PHIL',
        weight: 1.0,
        backgroundColor: '#22B14C', // Green for Phil
      },
      {
        label: 'GABE',
        weight: 1.0,
        backgroundColor: '#0000FF', // Blue for Gage
      },
      {
        label: 'DEWSK',
        weight: 1.0,
        backgroundColor: '#800080', // Purple for Dewski
      }
    ],
  },

  {
    name: 'Slot Bros Wheel',
    radius: 0.85,
    itemLabelRadius: 0.90,
    itemLabelRadiusMax: 0.35,
    itemLabelRotation: 180,
    itemLabelAlign: AlignText.left,
    itemLabelColors: ['#FFD700', '#FFFFFF', '#FF4500'], // Gold, white, and orange for vibrant slot colors
    itemLabelBaselineOffset: -0.07,
    itemLabelFont: 'Amatic SC',
    itemLabelFontSizeMax: 55,
    itemBackgroundColors: ['#FF4500', '#FFD700', '#FFFFFF', '#0000FF'], // Orange, gold, white, and blue
    rotationSpeedMax: 500,
    rotationResistance: -100,
    lineWidth: 1,
    lineColor: '#000', // Black color for contrast
    overlayImage: './img/example-3-overlay.svg',
    items: [
      {
        label: 'KARAOKE',
        backgroundColor: '#00FFFF', // Cyan
        weight: 10.0,
        image: './img/karaoke-icon.png', // Add your image path
        imageOpacity: 1,
        imageRadius: 0.5,
        imageRotation: 0,
        imageScale: 0.2,
      },
      {
        label: 'DEALER\'S CHOICE',
        backgroundColor: '#FFD700', // Gold
        weight: 10.0,
        image: './img/dealer-icon.png', // Add your image path
        imageOpacity: 1,
        imageRadius: 0.5,
        imageRotation: 0,
        imageScale: 0.2,
      },
      {
        label: 'TASTE TEST',
        backgroundColor: '#FFFF00', // Yellow
        weight: 10.0,
        image: './img/taste-test-icon.png', // Add your image path
        imageOpacity: 1,
        imageRadius: 0.5,
        imageRotation: 0,
        imageScale: 0.2,
      },
      {
        label: 'SHOTGUN',
        backgroundColor: '#FF4500', // Red
        weight: 10.0,
        image: './img/shotgun-icon.png', // Add your image path
        imageOpacity: 1,
        imageRadius: 0.5,
        imageRotation: 0,
        imageScale: 0.2,
      },
      {
        label: 'DILL SHOT',
        backgroundColor: '#FF69B4', // Pink
        weight: 10.0,
        image: './img/dill-shot-icon.png', // Add your image path
        imageOpacity: 1,
        imageRadius: 0.5,
        imageRotation: 0,
        imageScale: 0.2,
      },
      {
        label: 'FREE BUY IN',
        backgroundColor: '#800080', // Purple
        labelColor: '#fff',
        weight: 1.0,
      },
    ],
  },

];
