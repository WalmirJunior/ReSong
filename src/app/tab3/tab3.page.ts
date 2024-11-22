import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  reviews: any[] = [];
  loading = true;

  constructor(private reviewService: ReviewService, private auth: Auth) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      // Obtém reviews de outros usuários com os usernames
      this.reviews = await this.reviewService.getOtherUsersReviews(user.uid);
    }
    this.loading = false;
  }
}
