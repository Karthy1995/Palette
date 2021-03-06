import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ColormindService } from '../colormind.service';

@Component({
  selector: 'app-palette-card',
  templateUrl: './palette-card.component.html',
  styleUrls: ['./palette-card.component.css']
})
export class PaletteCardComponent implements OnInit {
  constructor(private colormind: ColormindService,private title:Title,private meta:Meta) {
    
  }
  public colorData:any;

  public message:any;
 public  showMessage:any;
  runs = 0;

  public colormindResponse:any;

  public lockedAmt:any;

  public initialized:any;
  public generating:any;

  ngOnInit() {
    this.title.setTitle('Color Palette');
    this.meta.addTag({name:'description',content:'description'});
    this.colorData = {};
    this.colorData['a'] = { lock: false };
    this.colorData['b'] = { lock: false };
    this.colorData['c'] = { lock: false };
    this.colorData['d'] = { lock: false };
    this.colorData['e'] = { lock: false };

    this.generateColor();
    // this.generateColorRGB();

    this.displayMessage('press space to generate palette');
  }

  displayMessage(str) {
    this.message = str;
    this.showMessage = true;
    setTimeout(
      function() {
        // this.showMessage = false;
      }.bind(this),
      2000
    );
  }

  generateColor() {
    this.runs++;
    this.generating = true;

    switch (this.runs) {
      case 2:
        this.displayMessage('Theme World');
        break;
      case 3:
        this.displayMessage('Theme Forest');
        break;
      case 4:
        this.displayMessage('Theme Folks');
        break;
      default:
        break;
    }

    // const locked = [];
    const locked = ['N', 'N', 'N', 'N', 'N'];
    let count = 0;
    let index = 0;
    let lockColors = false;
    for (const field of Object.keys(this.colorData)) {
      const { rgb, lock } = this.colorData[field];
      if (lock) {
        // locked.push(rgb);
        locked[index] = rgb;
        count++;
        lockColors = true;
      }
      index++;
    }
    const models = [
      'ui',
      'default',
      'sunset_photography',
      'american_revolutionary_art',
      'metroid_fusion',
      'raise_the_red_lantern'
    ];
    const randModel = models[Math.floor(Math.random() * models.length - 1)];

    this.lockedAmt = count;
    console.log(this.lockedAmt);
    if (this.lockedAmt === 5) {
      this.displayMessage('press r to unlock all colors');
    } else {
      for (let i = 0; i < 5; i++) {
        if (!locked[i]) {
          locked[i] = 'N';
        }
      }
      this.colormind.getColors(randModel, locked, lockColors).subscribe(
        data => (this.colormindResponse = data),
        error => console.log(error),
        () => {
          this.loadColors();
          this.initialized = true;
          this.generating = false;
        }
      );
    }
  }

  loadColors() {
    const { result } = this.colormindResponse;
    const { a, b, c, d, e } = this.colorData;

    let i = 0 + this.lockedAmt;
    console.log(this.lockedAmt);

    if (!a.lock) {
      a.rgb = result[0];
    }

    if (!b.lock) {
      b.rgb = result[1];
    }

    if (!c.lock) {
      c.rgb = result[2];
    }

    if (!d.lock) {
      d.rgb = result[3];
    }

    if (!e.lock) {
      e.rgb = result[4];
    }

    this.updateColorStyles();
  }

  getTextColor(rgb:any) {
    const avg = rgb.reduce((sum:any, value:any) => sum + value) / 3;
    if (avg < 127) {
      return this.getColorCode(rgb.map((x:any) => x + 100));
    } else {
      return this.getColorCode(rgb.map((x:any)=> x - 100));
    }
  }

  getColorCode(rgb:any) {
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }

  updateColorStyles() {
    for (const field of Object.keys(this.colorData)) {
      const rgb = this.colorData[field].rgb;
      this.colorData[field].rgbString = this.getColorCode(rgb);
      this.colorData[field].textColor = this.getTextColor(rgb);
      this.colorData[field].hex = this.rgbToHex(rgb);
    }
  }

  rgbToHex(rgb:any) {
    const hex = rgb
      .map((x:any) => {
        let value = x > 0 ? x.toString(16) : 0;
        if (value.length === 1) {
          value = '0' + value;
        }
        return value;
      })
      .join('')
      .toUpperCase();
    return `${hex}`;
  }

  hexToRgb(hex:any) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }

  toggleLock(lock:any) {
    this.colorData[lock].lock = !this.colorData[lock].lock;
  }

  copyTextToClipboard(text:any) {
    const txtArea = document.createElement('textarea');
    txtArea.id = 'txt';
    txtArea.style.position = 'fixed';
    txtArea.style.top = '0';
    txtArea.style.left = '0';
    txtArea.style.opacity = '0';
    txtArea.value = text;
    document.body.appendChild(txtArea);
    txtArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      if (successful) {
        this.displayMessage('hex value Copied ');
        return true;
      }
    } catch (err) {
      console.log('Oops, unable to copy');
    } finally {
      document.body.removeChild(txtArea);
    }
    return false;
  }

  editColor(color:any, event:any) {
    const len = event.target.innerText.trim().length;
    const selection = window.getSelection()!.type;

    if (event.keyCode === 13 || event.key === ' ') {
      event.preventDefault();

      const tmp = document.createElement('input');
      document.body.appendChild(tmp);
      tmp.focus();
      document.body.removeChild(tmp);

      const hex = event.target.innerHTML;
      if (hex.length === 6) {
        const rgb = this.hexToRgb(hex);

        this.colorData[color].rgb = rgb;
        this.colorData[color].lock = true;

        this.generateColor();
      } else {
        this.displayMessage('hex values need 6 digits');
        event.target.innerHTML = this.colorData[color].hex;
      }
    }
  }

  clickHex() {
    this.displayMessage('enter your own colors!');
    
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.generateColor();
    }

    if (event.key === 'r') {
      for (const field of Object.keys(this.colorData)) {
        this.colorData[field].lock = false;
        this.lockedAmt = 0;
      }
    }
  }
}
