import {Box, Container, Heading} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
//https://github.com/Shin-sibainu/my-three-portfolio

const LoadWeb13 = dynamic(() =>
        import("../components/web13"),
    {ssr: false}
)


export default function Section13() {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="description" content="description"/>
                <meta name="author" content="minoru horiuchi"/>
                <title>Minoru Hriuchi - Homepage</title>
            </Head>

            <Box
                as="main"
                width={"100vw"}
                height={"200vh"}
                zIndex="100"
                justifyContent="center"
                textAlign="center"
                fontSize="4rem"
                mt="70px"
            >
                {/*<LoadWeb13/>*/}
                <Heading as="h1">
                    Portfolio
                </Heading>
                <Box as="section" p="20px" fontSize="3.5rem" minHeight="100vh">
                    <Heading as="h2">
                        突き詰める最高のスキルを
                    </Heading>
                </Box>

                <Box as="section" p="20px" fontSize="3.5rem" minHeight="100vh">
                    <Heading as="h2">
                        My Projects
                    </Heading>
                    <Box as="p">私の作った作品です</Box>
                </Box>

                <Box as="section" p="20px" fontSize="3.5rem" minH="100vh">
                    <Heading as="h2">
                        My Skills
                    </Heading>
                    <Box as="p">HTML/CSS/Javascript</Box>
                </Box>

                <Box as="section" p="20px" fontSize="3.5rem" minH="100vh">
                    <Heading as="h2">
                        Engineer
                    </Heading>
                    <Box as="p">学び続ける好奇心</Box>
                </Box>

                <Box as="section" p="20px" fontSize="3.5rem" minH="100vh">
                    <Heading as="h2">
                        Contact Me
                    </Heading>
                    <Box as="p">お問い合わせはこちらから</Box>
                </Box>
            </Box>
        </>
    )
}