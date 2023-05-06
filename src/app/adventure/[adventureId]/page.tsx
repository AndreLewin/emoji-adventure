// import Component from "./Component";
import { Metadata } from "next";
import { prisma } from "../../../server/db/client"
import Component from "./Component";

export function generateStaticParams() {
  return [
    { adventureId: "clhc9a6x00001xr5wqqwjufm3" }
  ];
}

export async function generateMetadata({ params }: { params: { adventureId: string } }): Promise<Metadata> {
  const { adventureId } = params
  const adventure = await prisma.adventure.findFirst({
    where: { id: "clhc9a6x00001xr5wqqwjufm3" }
    // don't enable this before auth
    // where: { id: adventureId }
  });

  return {
    title: adventure?.name ?? "Emoji adventure",
    description: adventure?.description ?? "An adventure created with Emoji Adventure"
    // icons: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😀</text></svg>"
  }
}

export default async function Page({ params }: { params: { adventureId: string } }) {
  const { adventureId } = params;
  const adventure = await prisma.adventure.findFirst({
    where: { id: "clhc9a6x00001xr5wqqwjufm3" }
    // don't enable this before auth
    // where: { id: adventureId }
  });

  if (adventure === null) return (
    <div>
      <body>
        <div>404</div>
      </body>
    </div>
  )

  return (
    <div>
      <body>
        <Component adventure={adventure} />
      </body>
    </div>
  )
}