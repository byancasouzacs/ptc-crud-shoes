import prisma from "@database";

export const findCalcadosByTamanho = async (tamanho: number) => {
  return prisma.calcado.findMany({
    where: {
      tamanho,
    },
  });
};

export const findCalcadosByMarca = async (marca: string) => {
  return prisma.calcado.findMany({
    where: {
      marca: {
        equals: marca,
        mode: "insensitive",
      },
    },
  });
};

export const countTotalParesEmEstoque = async () => {
  const result = await prisma.calcado.aggregate({
    _sum: {
      quantidade_em_estoque: true,
    },
  });

  return result._sum.quantidade_em_estoque ?? 0;
};
