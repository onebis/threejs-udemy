import {Box, Container, Heading} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
//https://github.com/Shin-sibainu/my-three-portfolio

const LoadWeb13 = dynamic(()=>
    import("../components/web13"),
        {ssr: false}
)


export default function Section13() {
    return (
        <>
            <Box as="main" pb={8} backgroundImage="url('/images/bg.jpg')" width={"100%"} height={"100vh"}>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="description" content="description" />
                    <meta name="author" content="minoru horiuchi" />
                    <title>Minoru Hriuchi - Homepage</title>
                </Head>

                <LoadWeb13 />
                <Container
                    position={"absolute"}
                    top={"20%"}
                    left={"7%"}
                    maxWidth={"100%"}
                    color={"white"}
                >
                </Container>
            </Box>
        </>
    )
}