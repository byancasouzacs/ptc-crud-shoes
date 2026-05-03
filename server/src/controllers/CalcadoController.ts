import { Request, Response } from "express";
import prisma from "@database";
import {
  countTotalParesEmEstoque,
  findCalcadosByMarca,
  findCalcadosByTamanho,
} from "../repositories/CalcadoRepository";

const isPositiveNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const isNonNegativeInteger = (value: unknown) =>
  Number.isInteger(value) && Number(value) >= 0;

const isPositiveInteger = (value: unknown) =>
  Number.isInteger(value) && Number(value) > 0;

const hasText = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

export const createCalcado = async (req: Request, res: Response) => {
  try {
    const {
      nome_produto,
      cor,
      marca,
      tamanho,
      preco,
      quantidade_em_estoque,
    } = req.body;

    if (
      !hasText(nome_produto) ||
      !hasText(cor) ||
      !hasText(marca) ||
      !isPositiveInteger(tamanho) ||
      !isPositiveNumber(preco) ||
      !isNonNegativeInteger(quantidade_em_estoque)
    ) {
      return res.status(400).json({
        message:
          "Informe nome_produto, cor, marca, tamanho, preco e quantidade_em_estoque com valores validos.",
      });
    }

    const calcado = await prisma.calcado.create({
      data: {
        nome_produto: nome_produto.trim(),
        cor: cor.trim(),
        marca: marca.trim(),
        tamanho,
        preco,
        quantidade_em_estoque,
      },
    });

    return res.status(201).json(calcado);
  } catch (error) {
    return res.status(400).json({
      message: "Erro ao criar calcado.",
      error,
    });
  }
};

export const readAllCalcados = async (_req: Request, res: Response) => {
  try {
    const calcados = await prisma.calcado.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json(calcados);
  } catch (error) {
    return res.status(400).json({
      message: "Erro ao buscar calcados.",
      error,
    });
  }
};

export const updateCalcado = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!isPositiveInteger(id)) {
      return res.status(400).json({
        message: "Informe um id valido.",
      });
    }

    const {
      nome_produto,
      cor,
      marca,
      tamanho,
      preco,
      quantidade_em_estoque,
    } = req.body;

    const data: {
      nome_produto?: string;
      cor?: string;
      marca?: string;
      tamanho?: number;
      preco?: number;
      quantidade_em_estoque?: number;
    } = {};

    if (nome_produto !== undefined) {
      if (!hasText(nome_produto)) {
        return res.status(400).json({ message: "nome_produto invalido." });
      }
      data.nome_produto = nome_produto.trim();
    }

    if (cor !== undefined) {
      if (!hasText(cor)) {
        return res.status(400).json({ message: "cor invalida." });
      }
      data.cor = cor.trim();
    }

    if (marca !== undefined) {
      if (!hasText(marca)) {
        return res.status(400).json({ message: "marca invalida." });
      }
      data.marca = marca.trim();
    }

    if (tamanho !== undefined) {
      if (!isPositiveInteger(tamanho)) {
        return res.status(400).json({ message: "tamanho invalido." });
      }
      data.tamanho = tamanho;
    }

    if (preco !== undefined) {
      if (!isPositiveNumber(preco)) {
        return res.status(400).json({ message: "preco invalido." });
      }
      data.preco = preco;
    }

    if (quantidade_em_estoque !== undefined) {
      if (!isNonNegativeInteger(quantidade_em_estoque)) {
        return res.status(400).json({
          message: "quantidade_em_estoque invalida.",
        });
      }
      data.quantidade_em_estoque = quantidade_em_estoque;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Informe ao menos um campo para atualizar.",
      });
    }

    const calcado = await prisma.calcado.update({
      where: {
        id,
      },
      data,
    });

    return res.status(200).json(calcado);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({
        message: "Calcado nao encontrado.",
      });
    }

    return res.status(400).json({
      message: "Erro ao atualizar calcado.",
      error,
    });
  }
};

export const deleteCalcado = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!isPositiveInteger(id)) {
      return res.status(400).json({
        message: "Informe um id valido.",
      });
    }

    await prisma.calcado.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Calcado removido com sucesso.",
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({
        message: "Calcado nao encontrado.",
      });
    }

    return res.status(400).json({
      message: "Erro ao remover calcado.",
      error,
    });
  }
};

export const readCalcadosByTamanho = async (req: Request, res: Response) => {
  try {
    const tamanho = Number(req.params.tamanho);

    if (!isPositiveInteger(tamanho)) {
      return res.status(400).json({
        message: "Informe um tamanho valido.",
      });
    }

    const calcados = await findCalcadosByTamanho(tamanho);

    return res.status(200).json(calcados);
  } catch (error) {
    return res.status(400).json({
      message: "Erro ao buscar calcados por tamanho.",
      error,
    });
  }
};

export const readCalcadosByMarca = async (req: Request, res: Response) => {
  try {
    const { marca } = req.params;

    if (!hasText(marca)) {
      return res.status(400).json({
        message: "Informe uma marca valida.",
      });
    }

    const calcados = await findCalcadosByMarca(marca);

    return res.status(200).json(calcados);
  } catch (error) {
    return res.status(400).json({
      message: "Erro ao buscar calcados por marca.",
      error,
    });
  }
};

export const readTotalParesEmEstoque = async (_req: Request, res: Response) => {
  try {
    const total = await countTotalParesEmEstoque();

    return res.status(200).json({
      total,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Erro ao contar pares em estoque.",
      error,
    });
  }
};
