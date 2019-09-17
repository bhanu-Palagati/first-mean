import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  private postSub: Subscription;
  constructor(private postService: PostsService, private router: Router) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService.getUpdatedPosts().subscribe((posts: Post[]) => {this.posts = posts;
    this.isLoading = false;
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
    this.postService.getPosts();
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
