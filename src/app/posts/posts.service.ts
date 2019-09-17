import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PortalHostDirective } from '@angular/cdk/portal';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {title: post.title, content: post.content, id: post._id};
        });
    }))
    .subscribe((posts) => {
      this.posts = posts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getUpdatedPosts() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post =  {id: null, title, content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((res) => {
    console.log(res.message);
    post.id = res.postId;
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
    this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe( data => {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    console.log('here');
    this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(result => {
    this.posts = this.posts.filter(p => p.id !== id);
    this.postsUpdated.next([...this.posts, post]);
    this.router.navigate(['/']);
      });
  }

}
