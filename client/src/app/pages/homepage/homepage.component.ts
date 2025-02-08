import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpService } from '../../services/http/http.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-homepage',
    imports: [RouterModule, MatButtonModule, MatDividerModule, MatIconModule],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css',
})
export class HomepageComponent {
    serverResponse = '';
    constructor(private httpService: HttpService) {}

    getServerStatus(): void {
        this.httpService.ping().subscribe((status) => {
            this.serverResponse = `${status.message} - ${status.lastPing != null ? new Date(status.lastPing)?.toLocaleString('fr-FR') : ''}`;
        });
    }
}
