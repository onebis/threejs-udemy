import {Box, Container, Heading} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
//https://github.com/Shin-sibainu/my-three-portfolio

const LoadWeb12 = dynamic(()=>
    import("../components/web12"),
        {ssr: false}
)


export default function Section12() {
    return (
        <>
            <Box as="main" pb={8} backgroundImage="url('/images/bg.jpg')" width={"100%"} height={"100vh"}>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="description" />
                    <meta name="author" content="minoru horiuchi" />
                    <title>Minoru Hriuchi - Homepage</title>
                </Head>

                <LoadWeb12 />
                <Container
                    position={"absolute"}
                    top={"20%"}
                    left={"7%"}
                    maxWidth={"100%"}
                    color={"white"}
                >
                    <Heading
                        as="h1"
                        fontSize={"7rem"}
                        mb={"1.3rem"}
                    >
                        未到達の次元へ。
                    </Heading>
                    <Box as="p" fontSize={"2rem"}>
                        ありふれたエンジニアで、終わらせない。
                        <br />
                        人々を感動させる技術を身に着ける。
                        <br />
                        あなたが求めるスキルが、今ここに。
                    </Box>
                </Container>
            </Box>
            <style jsx>{`
              main {
                  overflow: hidden;
              }
            `}</style>
        </>
    )
}