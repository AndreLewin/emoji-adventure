## Rule of hooks with useQuery

You can not use useQuery inside useCallback or useMutation
Instead of doing:

```ts
  const editCard = trpc.card.edit.useMutation({
    async onMutate({ id, data }) {
      const allCards = trpc.card.getAll.useQuery().data;
      // ...
    },
  });
```

Do
```ts
  const utils = trpc.useContext();

  const editCard = trpc.card.edit.useMutation({
    async onMutate({ id, data }) {
      const allCards = utils.cards.getAll.getData();
    },
  });
```

## Edit Prisma Schema

1) change schema.prisma

2) reflect the changes on the db
npx prisma db push

3) generate prisma client (for typing and using studio)
npx prisma generate

If types do not update when using the client:
https://github.com/prisma/prisma/issues/14722

Click on Prisma client then F12 to go to the definition.
The type error will disappear

4) add/edit data
// https://github.com/prisma/prisma/issues/10649
bug, if you use supabase, you need to downgrade to node v16 (nvm use 16)
npx prisma studio

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
