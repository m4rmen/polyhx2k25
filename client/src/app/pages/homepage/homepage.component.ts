/* eslint-disable @typescript-eslint/no-this-alias */
import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as THREE from 'three';

@Component({
    selector: 'app-homepage',
    imports: [RouterModule, MatButtonModule, MatDividerModule, MatIconModule],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css',
})
export class HomepageComponent  implements AfterViewInit, OnDestroy {
    @ViewChild('canvas3D', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private cube!: THREE.Mesh;
    private animationFrameId!: number;
  
    private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
    }
  
    ngAfterViewInit(): void {
      this.createScene();
      this.startRenderingLoop();
    }
  
    private createScene(): void {
      // 1. Create a scene
      this.scene = new THREE.Scene();
  
      // 2. Set up a camera
      const fov = 75;
      const aspect = this.getAspectRatio();
      const near = 0.1;
      const far = 1000;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.z = 5;
  
      // 3. Configure the renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,    // if you want a transparent background
        antialias: true // smoother edges
      });
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  
      // 4. Create a simple cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);
    }
  
    private getAspectRatio(): number {
      return this.canvas.clientWidth / this.canvas.clientHeight;
    }
  
    private startRenderingLoop(): void {
      const component: HomepageComponent = this;
  
      (function render() {
        component.animationFrameId = requestAnimationFrame(render);
        component.update();
        component.renderer.render(component.scene, component.camera);
      }());
    }
  
    private update(): void {
      // Rotate the cube slightly on each frame
      if (this.cube) {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
      }
    }
  
    ngOnDestroy(): void {
      // Clean up the animation frame to prevent memory leaks
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
}
