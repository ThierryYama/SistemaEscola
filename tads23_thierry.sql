-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 01-Jun-2025 às 18:16
-- Versão do servidor: 8.0.39
-- versão do PHP: 7.4.3-4ubuntu2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tads23_thierry`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv1` ()  begin
		SELECT f.titulo, c.primeiro_nome 
		from filme f, cliente c, inventario i, aluguel a,pagamento p where
		f.filme_id = i.filme_id and  i.inventario_id = a.inventario_id and
		a.cliente_id = c.cliente_id and a.aluguel_id = p.aluguel_id and
		a.data_de_devolucao is not null and p.valor is null;
	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv10` (`categoria` VARCHAR(45))  begin
		SELECT c.email from cliente c, aluguel a, inventario i, filme_categoria fc, categoria ca WHERE
		c.cliente_id = a.cliente_id and a.inventario_id = i.inventario_id and i.filme_id = fc.filme_id
		and fc.categoria_id = ca.categoria_id and ca.nome = categoria and a.aluguel_id >=3;
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv2` ()  begin
 DECLARE id_filme_locado INT;
 CALL filme_mais_locado(id_filme_locado);
 SELECT a.primeiro_nome, a.ultimo_nome from ator a, filme_ator fa, filme f WHERE f.filme_id = fa.filme_id and 
 a.ator_id = fa.ator_id and f.filme_id = id_filme_locado;
end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv3` (`mes` INT)  begin
		SELECT c.cliente_id, c.primeiro_nome, c.ultimo_nome, MAX(a.data_de_aluguel) AS data_de_aluguel
		FROM cliente c, aluguel a  WHERE c.cliente_id = a.cliente_id
		GROUP BY c.cliente_id, c.primeiro_nome, c.ultimo_nome
		HAVING MAX(a.data_de_aluguel) OR MAX(a.data_de_aluguel) <= DATE_SUB(NOW(), INTERVAL mes MONTH);
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv4` (`mes` INT)  begin
		SELECT c.nome, sum(p.valor) from categoria c, pagamento p, aluguel a, inventario i, filme f, filme_categoria fc WHERE 
		p.aluguel_id = a.aluguel_id and a.inventario_id = i.inventario_id and i.filme_id = f.filme_id and f.filme_id = fc.filme_id and
		fc.categoria_id = c.categoria_id and MONTH(p.data_de_pagamento) = mes GROUP BY c.nome;
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv5` ()  begin
		SELECT f.titulo from filme f, idioma i 
		where i.idioma_id = f.idioma_id and f.idioma_original_id = f.idioma_id;
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv6` (`entrada` DATE, `saida` DATE)  begin
		SELECT f.primeiro_nome, f.ultimo_nome, count(a.aluguel_id) as 'Numero de Locacoes' from funcionario f, aluguel a WHERE
		f.funcionario_id = a.funcionario_id and a.data_de_aluguel BETWEEN entrada and saida GROUP BY f.funcionario_id order by 'Numero de Locacoes'
		DESC LIMIT 1;
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv7` (`numero` INT)  begin
		SELECT count(*) as 'Numero_de_Filmes' from filme f, inventario i, loja l WHERE 
		l.loja_id = i.loja_id and f.filme_id = i.filme_id and l.loja_id = numero;
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv8` (`num` INT)  begin
		SELECT f.titulo, c.primeiro_nome, c.ultimo_nome from filme f, cliente c, inventario i, aluguel a WHERE
		f.filme_id = i.filme_id and i.inventario_id = a.inventario_id and c.cliente_id = a.cliente_id and
		a.data_de_devolucao != num;
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `atv9` ()  begin
		Select month(c.data_criacao) as 'mes', count(*) as 'clientes ativo' from cliente c WHERE
		c.ativo = 1 GROUP BY month(c.data_criacao) order by 'clientes ativo';
 	end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex1` (IN `sobrenome` VARCHAR(45))  BEGIN
	SELECT nome from sp_pessoa where nome like concat('%', sobrenome);
END$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex2` (IN `mes` INT)  BEGIN
	SELECT nome, data_nascimento from sp_pessoa where extract(month from data_nascimento) = mes;
END$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex3` (IN `dia` INT, IN `mes` INT)  BEGIN
	SELECT nome, data_nascimento from sp_pessoa WHERE extract(day from data_nascimento)=dia && extract(month from data_nascimento)=mes;
END$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex4` (IN `numero_ocorrencia` INT)  BEGIN
	SELECT COUNT(*) as 'Placas' FROM sp_veiculo v where v.ocorrencia = numero_ocorrencia;
END$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex5` ()  BEGIN
	SELECT ocorrencia, count(*) as 'quantidade_ocorrencia' from sp_veiculo GROUP BY ocorrencia order by count(*) desc limit 1;
END$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex6` ()  BEGIN
	SELECT extract(month from data), COUNT(*) as 'quantidade_ocorrencia' from sp_veiculo group by extract(month from data) order by COUNT(*) desc limit 1;
END$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex7` (IN `mes` INT)  Begin
	Select ocorrencia, count(*) as 'numero_da_ocorrencia' from sp_veiculo where extract(month from data)=mes group by ocorrencia order by count(*) desc limit 1;
End$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `ex8` (IN `mes` INT)  Begin
	Select ocorrencia, count(*) as 'numero_da_ocorrencia' from sp_veiculo where extract(month from data)=mes group by ocorrencia order by count(*) desc limit 1;
End$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `filme_mais_locado` (OUT `num` INT)  begin
DECLARE filme_id INT;
SELECT f.filme_id INTO filme_id
FROM aluguel a, inventario i, filme f WHERE a.inventario_id = i.inventario_id AND i.filme_id = f.filme_id
GROUP BY f.filme_id
ORDER BY COUNT(a.aluguel_id) DESC
LIMIT 1;
SET num = filme_id;
end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `sp_condado` ()  begin

declare existe_mais_linhas int default 0;
declare populacao_t int;
declare new_pop int;
declare nome_condado varchar(45);
declare nova_populacao int;		

declare meuCursor cursor for select condado,populacao from cur_condado where populacao > 2000000;

declare continue handler for not found set existe_mais_linhas =1;

open meuCursor;

meuLoop: LOOP
 fetch meuCursor into nome_condado, populacao_t;

 if existe_mais_linhas = 1 then
 leave meuLoop;
 end if;

SET nova_populacao = populacao_t/2;

DELETE FROM cur_condado Where condado = nome_condado;

INSERT INTO cur_condado (condado, populacao)
VALUES (Concat(nome_condado, '1'), nova_populacao);

INSERT INTO cur_condado (condado, populacao)
VALUES (Concat(nome_condado, '2'), nova_populacao);
end LOOP meuLoop;

close meuCursor;

end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `sp_temp` ()  begin

declare existe_mais_linhas int default 0;
declare temperatura_t int;

declare meuCursor cursor for select temperatura from cursores;

declare continue handler for not found set existe_mais_linhas =1;

open meuCursor;

meuLoop: LOOP
 fetch meuCursor into temperatura_t;

 if existe_mais_linhas = 1 then
 leave meuLoop;
 end if;

	if (temperatura_t <= 10) then
		UPDATE cursores 
		SET descricao= "frio" 
		where temperatura = temperatura_t;
	elseif(temperatura_t <=20) then	
		UPDATE cursores 
		SET descricao= "normal"
		where temperatura = temperatura_t;
	else
		UPDATE cursores 
		SET descricao= "quente" 
		where temperatura = temperatura_t;
	end if;

end LOOP meuLoop;

close meuCursor;

end$$

CREATE DEFINER=`tads23_thierry`@`%` PROCEDURE `SQLEXEC` (IN `comando_sql` TEXT, IN `cod_usuario_sistema` INT, IN `tabela` VARCHAR(45), IN `chave` INT, OUT `cod_retorno` TINYINT)  BEGIN # <- Começa o script sql
    DECLARE aux_str TEXT; # <- declaração de variavel auxiliar para string (tipo text)
    DECLARE aux_chave INT; # <- declaração de variavel de chave (tipo inteiro)
	DECLARE evento TEXT; # <- declaração de variavel de evento (tipo text)
	DECLARE EXIT HANDLER FOR SQLEXCEPTION #<- declaração de handler (abre uma thread para monitoramento de sqlexecption (erro de processamento))
	  BEGIN # <- executa os comandos caso haja erro
   	     SET cod_retorno=1;  # <- Atribui "1" para o cod de retorno
   	     commit;
		 #ROLLBACK; #<- irá parar o codigo e desfazer o erro exception até o start da transaction
      END; # <- finaliza o script de sqlexception (monitoramento)
	DECLARE EXIT HANDLER FOR SQLWARNING # <- declaração de handler (thread para sqlwarning(sobrecarga/dá um alerta))
	  BEGIN # <- começa o script caso haja um warning
		SET cod_retorno=2;  # <- Atribui "2" para o cod de retorno
		ROLLBACK; #<- irá parar o codigo e desfazer o warning até o start da transaction
	  END; # <- finaliza o script de sqlwarning(monitoramento)
	START TRANSACTION; #<- começo da transação e execução do comando sql 
		SET @S=COMANDO_SQL; # <- Seta o comando_sql em uma variavel @s
		PREPARE STMT FROM @S; # <- prepara o comando sql que está em @S
		EXECUTE STMT; # <- executa o comando sql
		DEALLOCATE PREPARE STMT; # <- se livra dos recursos de "stmt"
		SET aux_str = UPPER(comando_sql); #<- variavel recebe o comando_sql em caixa alta
		SELECT SUBSTRING_INDEX(aux_str, ' ', 1) INTO evento; #<- Armazena em "evento" até chegar no primeiro espaço da "aux_str"
        	IF (chave=-1) then #<- verifica se a chave é igual a -1
                #SELECT AUTO_INCREMENT INTO aux_chave FROM information_schema.tables WHERE TABLE_NAME = lower(tabela) AND TABLE_SCHEMA = 'tads23_thierry'; #<- Seleciona um "auto_increment" na variavel "aux_chave" pega os metadados para as tabelas e filtra pelo nome da tabela(deixa em minusculo) e o retorno do nome do esquema do objeto = "transação"
			#SET aux_chave=aux_chave-1; #<- diminui 1 da variavel "aux_chave"
                SET chave=10;  #<- seta a chave com o valor da variavel "aux_Chave"
		END IF; # finaliza o if
  		INSERT INTO ts_historico(codigo_usuario_sistema,evento,tabela,chave,data_hora,comando_sql) VALUES (cod_usuario_sistema, evento, lower(tabela), chave, now(), comando_sql); #<-Insere na tabela hisotrico toda a auditoria feita ou seja o codigo de usuario, o evento, a tabela afetada, a chave, o horario, e o comando sql)
		SET cod_retorno=0; #<- Atribui o valor de "0" para o cod de retorno
	COMMIT; #<- quando chegar aqui será consolidado no banco
END$$

--
-- Funções
--
CREATE DEFINER=`tads23_thierry`@`%` FUNCTION `fun_email` (`email` VARCHAR(255)) RETURNS VARCHAR(255) CHARSET utf8mb4 begin

Declare resultado VARCHAR(255);

if email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|edu|org|net|gov|br|com\.br|edu\.br|org\.br)$' then #<-- função comum para validação de email
	SET resultado = 'Estrutura Válida';
else
	SET resultado = 'Estrutura Inválida';
end if;
	
return resultado;
end$$

CREATE DEFINER=`tads23_thierry`@`%` FUNCTION `fun_nome` (`nomeTot` VARCHAR(45)) RETURNS VARCHAR(45) CHARSET utf8mb4 begin
Declare nome, primeiro_nome, ultimo_nome VARCHAR(45);

SET nome = upper(nomeTOT);

SET primeiro_nome = SUBSTRING_INDEX(nome, ' ', 1);
SET ultimo_nome = SUBSTRING_INDEX(nome, ' ', -1);

return concat(primeiro_nome, ' ', ultimo_nome);

end$$

CREATE DEFINER=`tads23_thierry`@`%` FUNCTION `fun_valor` (`valor` FLOAT, `ano` INT, `percentual` FLOAT) RETURNS FLOAT begin

Declare valor_final float;
Declare ano_tot int;

SET ano_tot =  year(CURRENT_DATE) - ano; 
SET valor_final = valor;

While ano_tot > 0 do
	SET valor_final = valor_final * (1 - percentual / 100);
	SET ano_tot = ano_tot - 1;
END While;

return valor_final;

end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `alunos`
--

CREATE TABLE `alunos` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  `senha` varchar(256) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `id_turma` int DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `alunos`
--

INSERT INTO `alunos` (`id`, `nome`, `email`, `matricula`, `senha`, `id_turma`, `createdAt`, `deletedAt`) VALUES
(1, 'Thierry', 'thierry@teste.com', '123', '$2b$10$jKf1dOLReAHzVV9qpUrlf.l3j7b3g5Ih0wrP3BacTokcetN7bPx..', 1, '2025-05-31 21:13:36', NULL),
(2, 'Ana', 'ana@teste.com', '1234', '$2b$10$7NU/oH4eMWq2hu88ZTWu7esiLesnpMPDp/HqkZDEqZiH/r3u.raNe', 1, '2025-05-31 21:14:02', NULL),
(3, 'Alice', 'alice@teste.com', '12345', '$2b$10$P3YG3ofqOwVnW6vz5Qu6WeI3p01LLPdaWwpYqh3cdDud2Gy/p5vca', 1, '2025-05-31 21:15:49', NULL),
(10, 'Pedro Atualizado', 'pedro.atualizado1748808683027@teste.com', 'MATRICULA1748808683027', 'novaSenha456', 1, '2025-06-01 20:11:23', '2025-06-01 20:11:23');

-- --------------------------------------------------------

--
-- Estrutura da tabela `aluno_disciplinas`
--

CREATE TABLE `aluno_disciplinas` (
  `id` int NOT NULL,
  `alunoId` int DEFAULT NULL,
  `disciplinaId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `aluno_disciplinas`
--

INSERT INTO `aluno_disciplinas` (`id`, `alunoId`, `disciplinaId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, NULL, NULL, NULL),
(2, 2, 1, NULL, NULL, NULL),
(3, 3, 1, NULL, NULL, NULL),
(4, 1, 2, NULL, NULL, NULL),
(5, 2, 2, NULL, NULL, NULL),
(6, 3, 2, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `cursos`
--

CREATE TABLE `cursos` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `cursos`
--

INSERT INTO `cursos` (`id`, `nome`, `descricao`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Tads', 'tecnologia', '2025-05-31 21:10:20', '2025-05-31 21:10:20', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `disciplinas`
--

CREATE TABLE `disciplinas` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `id_professor` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `disciplinas`
--

INSERT INTO `disciplinas` (`id`, `nome`, `id_professor`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'OO', 1, '2025-05-31 21:08:46', '2025-05-31 21:08:46', NULL),
(2, 'Backend', 1, '2025-05-31 21:08:56', '2025-05-31 21:08:56', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `notas`
--

CREATE TABLE `notas` (
  `id` int NOT NULL,
  `alunoId` int DEFAULT NULL,
  `disciplinaId` int DEFAULT NULL,
  `nota` decimal(5,2) DEFAULT NULL,
  `data_avaliacao` date DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `notas`
--

INSERT INTO `notas` (`id`, `alunoId`, `disciplinaId`, `nota`, `data_avaliacao`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '8.00', '2026-10-10', '2025-05-31 21:23:51', '2025-05-31 21:23:51', NULL),
(2, 1, 1, '8.00', '2026-10-10', '2025-05-31 21:23:52', '2025-05-31 21:23:52', NULL),
(3, 1, 1, '8.00', '2026-10-10', '2025-05-31 21:23:53', '2025-05-31 21:23:53', NULL),
(4, 1, 1, '8.00', '2026-10-10', '2025-05-31 21:23:57', '2025-05-31 21:23:57', NULL),
(5, 2, 1, '5.00', '2026-10-10', '2025-05-31 21:24:04', '2025-05-31 21:24:04', NULL),
(6, 2, 1, '5.00', '2026-10-10', '2025-05-31 21:24:04', '2025-05-31 21:24:04', NULL),
(7, 2, 1, '5.00', '2026-10-10', '2025-05-31 21:24:04', '2025-05-31 21:24:04', NULL),
(8, 3, 1, '9.00', '2026-10-10', '2025-05-31 21:24:10', '2025-05-31 21:24:10', NULL),
(9, 3, 1, '9.00', '2026-10-10', '2025-05-31 21:24:11', '2025-05-31 21:24:11', NULL),
(10, 3, 1, '9.00', '2026-10-10', '2025-05-31 21:24:12', '2025-05-31 21:24:12', NULL),
(11, 1, 2, '5.00', '2025-03-01', '2025-05-31 21:28:38', '2025-05-31 21:28:38', NULL),
(12, 1, 2, '5.00', '2025-03-01', '2025-05-31 21:28:40', '2025-05-31 21:28:40', NULL),
(13, 1, 2, '5.00', '2025-03-01', '2025-05-31 21:28:40', '2025-05-31 21:28:40', NULL),
(14, 2, 2, '9.00', '2025-03-01', '2025-05-31 21:28:45', '2025-05-31 21:28:45', NULL),
(15, 2, 2, '9.00', '2025-03-01', '2025-05-31 21:28:45', '2025-05-31 21:28:45', NULL),
(16, 2, 2, '9.00', '2025-03-01', '2025-05-31 21:28:45', '2025-05-31 21:28:45', NULL),
(17, 3, 2, '6.00', '2025-03-01', '2025-05-31 21:28:51', '2025-05-31 21:28:51', NULL),
(18, 3, 2, '6.00', '2025-03-01', '2025-05-31 21:28:51', '2025-05-31 21:28:51', NULL),
(19, 3, 2, '6.00', '2025-03-01', '2025-05-31 21:28:51', '2025-05-31 21:28:51', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `presencas`
--

CREATE TABLE `presencas` (
  `id` int NOT NULL,
  `alunoId` int DEFAULT NULL,
  `disciplinaId` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `presente` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `presencas`
--

INSERT INTO `presencas` (`id`, `alunoId`, `disciplinaId`, `data`, `presente`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '2026-10-10', 1, '2025-05-31 21:24:52', '2025-05-31 21:24:52', NULL),
(2, 1, 1, '2026-10-10', 1, '2025-05-31 21:24:53', '2025-05-31 21:24:53', NULL),
(3, 1, 1, '2026-10-10', 1, '2025-05-31 21:24:53', '2025-05-31 21:24:53', NULL),
(4, 1, 1, '2026-10-10', 1, '2025-05-31 21:24:54', '2025-05-31 21:24:54', NULL),
(5, 2, 1, '2026-10-10', 0, '2025-05-31 21:24:59', '2025-05-31 21:24:59', NULL),
(6, 2, 1, '2026-10-10', 0, '2025-05-31 21:25:00', '2025-05-31 21:25:00', NULL),
(7, 2, 1, '2026-10-10', 0, '2025-05-31 21:25:01', '2025-05-31 21:25:01', NULL),
(8, 3, 1, '2026-10-10', 1, '2025-05-31 21:25:04', '2025-05-31 21:25:04', NULL),
(9, 3, 1, '2026-10-10', 1, '2025-05-31 21:25:05', '2025-05-31 21:25:05', NULL),
(10, 3, 1, '2026-10-10', 1, '2025-05-31 21:25:05', '2025-05-31 21:25:05', NULL),
(11, 1, 2, '2026-10-10', 0, '2025-05-31 21:25:11', '2025-05-31 21:25:11', NULL),
(12, 1, 2, '2026-10-10', 0, '2025-05-31 21:25:11', '2025-05-31 21:25:11', NULL),
(13, 1, 2, '2026-10-10', 0, '2025-05-31 21:25:11', '2025-05-31 21:25:11', NULL),
(14, 2, 2, '2026-10-10', 1, '2025-05-31 21:25:14', '2025-05-31 21:25:14', NULL),
(15, 2, 2, '2026-10-10', 1, '2025-05-31 21:25:15', '2025-05-31 21:25:15', NULL),
(16, 2, 2, '2026-10-10', 1, '2025-05-31 21:25:15', '2025-05-31 21:25:15', NULL),
(17, 3, 2, '2026-10-10', 0, '2025-05-31 21:25:19', '2025-05-31 21:25:19', NULL),
(18, 3, 2, '2026-10-10', 0, '2025-05-31 21:25:20', '2025-05-31 21:25:20', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `professores`
--

CREATE TABLE `professores` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `siape` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `senha` varchar(256) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `professores`
--

INSERT INTO `professores` (`id`, `nome`, `email`, `siape`, `senha`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'maritza', 'maritza@teste.com', '0123', '$2b$10$rFdHo0fYK.HTIOSfq66D0etfE.mPLgd9tvP.gzynSOT6ZJA8QcYCi', '2025-05-31 21:07:10', '2025-05-31 21:07:10', NULL),
(9, 'João Atualizado', 'joao.atualizado1748806745301@teste.com', 'SIAPE-ATUALIZADO-1748806745301', 'novaSenha456', '2025-06-01 19:39:05', '2025-06-01 19:39:06', '2025-06-01 19:39:06'),
(10, 'João Atualizado', 'joao.atualizado1748807670075@teste.com', 'SIAPE-ATUALIZADO-1748807670075', 'novaSenha456', '2025-06-01 19:54:30', '2025-06-01 19:54:30', '2025-06-01 19:54:30'),
(11, 'João Atualizado', 'joao.atualizado1748807708566@teste.com', 'SIAPE-ATUALIZADO-1748807708566', 'novaSenha456', '2025-06-01 19:55:08', '2025-06-01 19:55:08', '2025-06-01 19:55:08'),
(24, 'Professor Teste', 'teste@exemplo.com', '6543211', '$2b$10$Wk0qLHniyFz31jtAlPcu2.6qJ9Rfc7ghtQuAaoWe.LPNe/t/BX2n.', '2025-06-01 20:32:58', '2025-06-01 20:32:58', '2025-06-01 20:32:58'),
(25, 'Professor Teste', 'teste2@exemplo.com', '9876541', '$2b$10$Wk0qLHniyFz31jtAlPcu2.6qJ9Rfc7ghtQuAaoWe.LPNe/t/BX2n.', '2025-06-01 20:32:58', '2025-06-01 20:32:58', '2025-06-01 20:32:58'),
(26, 'Professor Teste', 'teste1@exemplo.com', '65432111', '$2b$10$wF4KVtwDi8AtpRxx6pNxb.meOHEDQZFnz5G1mRh92.oB93Gw.qyoS', '2025-06-01 20:35:56', '2025-06-01 20:35:56', '2025-06-01 20:35:56'),
(27, 'Professor Teste', 'teste12@exemplo.com', '98765411', '$2b$10$wF4KVtwDi8AtpRxx6pNxb.meOHEDQZFnz5G1mRh92.oB93Gw.qyoS', '2025-06-01 20:35:56', '2025-06-01 20:35:56', '2025-06-01 20:35:56');

-- --------------------------------------------------------

--
-- Estrutura da tabela `turmas`
--

CREATE TABLE `turmas` (
  `id` int NOT NULL,
  `nome` varchar(50) NOT NULL,
  `periodo` varchar(50) DEFAULT NULL,
  `id_curso` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `turmas`
--

INSERT INTO `turmas` (`id`, `nome`, `periodo`, `id_curso`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Tads 23', 'manha', 1, '2025-05-31 21:11:27', '2025-05-31 21:11:27', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `alunos`
--
ALTER TABLE `alunos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `id_turma` (`id_turma`);

--
-- Índices para tabela `aluno_disciplinas`
--
ALTER TABLE `aluno_disciplinas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alunoId` (`alunoId`),
  ADD KEY `disciplinaId` (`disciplinaId`);

--
-- Índices para tabela `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `disciplinas`
--
ALTER TABLE `disciplinas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_professor` (`id_professor`);

--
-- Índices para tabela `notas`
--
ALTER TABLE `notas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alunoId` (`alunoId`),
  ADD KEY `disciplinaId` (`disciplinaId`);

--
-- Índices para tabela `presencas`
--
ALTER TABLE `presencas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alunoId` (`alunoId`),
  ADD KEY `disciplinaId` (`disciplinaId`);

--
-- Índices para tabela `professores`
--
ALTER TABLE `professores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `matricula` (`siape`);

--
-- Índices para tabela `turmas`
--
ALTER TABLE `turmas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_curso` (`id_curso`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alunos`
--
ALTER TABLE `alunos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `aluno_disciplinas`
--
ALTER TABLE `aluno_disciplinas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `disciplinas`
--
ALTER TABLE `disciplinas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `notas`
--
ALTER TABLE `notas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `presencas`
--
ALTER TABLE `presencas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `professores`
--
ALTER TABLE `professores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de tabela `turmas`
--
ALTER TABLE `turmas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `alunos`
--
ALTER TABLE `alunos`
  ADD CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`id_turma`) REFERENCES `turmas` (`id`);

--
-- Limitadores para a tabela `aluno_disciplinas`
--
ALTER TABLE `aluno_disciplinas`
  ADD CONSTRAINT `aluno_disciplinas_ibfk_1` FOREIGN KEY (`alunoId`) REFERENCES `alunos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `aluno_disciplinas_ibfk_2` FOREIGN KEY (`disciplinaId`) REFERENCES `disciplinas` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `disciplinas`
--
ALTER TABLE `disciplinas`
  ADD CONSTRAINT `disciplinas_ibfk_1` FOREIGN KEY (`id_professor`) REFERENCES `professores` (`id`);

--
-- Limitadores para a tabela `notas`
--
ALTER TABLE `notas`
  ADD CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`alunoId`) REFERENCES `alunos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notas_ibfk_2` FOREIGN KEY (`disciplinaId`) REFERENCES `disciplinas` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `presencas`
--
ALTER TABLE `presencas`
  ADD CONSTRAINT `presencas_ibfk_1` FOREIGN KEY (`alunoId`) REFERENCES `alunos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `presencas_ibfk_2` FOREIGN KEY (`disciplinaId`) REFERENCES `disciplinas` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `turmas`
--
ALTER TABLE `turmas`
  ADD CONSTRAINT `turmas_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
