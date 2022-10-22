# Real Me

Just another social media platform, but this time it's for real.

## Inspiration

Real me inspired from the popular social me [BeReal](https://bereal.com). So I decided to make a similar social media platform for free and open source.

## What it does

Similar to BeReal, Real Me only allows users to capture images without any edit or filter. Real Me send notification to the users when time to capture images. Users can also see the images of other users in the feed section.

Users can send friend request to other users and can also see the images of their friends. Every events are notified to the users via Courier Notification System.

## How we built it

![Real Me](https://i.imgur.com/ozilaMC.jpeg)

I built Real Me using following technologies:

- Next.js (React)
- tRPC (API)
- PostgreSQL (Database)
- Courier Notification System
- Supabase Storage (Image Storage)
- \*Courier-OTP (OTP System)
- Vercel (Hosting)

_Note_: I created a custom OTP system using Courier Notification System and Redis. For more details, check out the [source code](https://github.com/n4ze3m/courier-opt) and [npm package](https://www.npmjs.com/package/courier-otp).

## Challenges we ran into

- Integrating Courier In-app Notification and Toast Notification System is a bit tricky to me. Overall, I'm happy with the result.

- Image Capturing is a nightmare to me. Because of auto capturing, I had to use `setInterval` to capture image (second image). I'm not sure if it's the best way to do it.

## Accomplishments that we're proud of

I'm really happy with the result. I learned a lot of new things while building this project. It's like a mini BeReal for me. 

I'm also proud of the Courier OTP System. I'm planning to improving.

## What we learned

- How to use Courier Notification System
- How to use tRPC
- How to use Supabase Storage
- How to use Redis for OTP System


## What's next for Real Me

Real Me is still in development. I'm planning to add more features like:

- Improve Image Capturing
- Add New Features
- Like and Comment System

Real Me welcomes any contributions. If you want to contribute, check out the [source code](https://github.com/n4ze3m/real-me).