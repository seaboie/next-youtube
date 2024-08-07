This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Install MongoDB

```bash
npm install mongodb
```

## Install mongoose

```bash
npm install mongoose
```

## MongoDB (using Mongoose)

- [User API](https://github.com/seaboie/next-youtube/blob/aab87b671db03da077db00c6df9d42dddfcb7a5d/app/api/users/route.ts#L6)

> Fetched users

```ts
// Find all users
const users = await User.find();

// Find all users with age greater than 30
const users = await User.find({ age: { $gt: 30 } });

// Find users by name and sort by age descending
const users = await User.find({ name: "John Doe" }).sort({ age: -1 });
```

> Post new user

```ts
// get data from `request.json()` keep in `body` constant
const body = await request.json();
await connect();

// Save new user data to database
const newUser = new User(body);
await newUser.save();
```  

> PATCH user  
```ts

```  

