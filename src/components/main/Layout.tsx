import { Container } from '@chakra-ui/react';
import React from 'react';

type LayoutProps = {
  children: React.ReactElement;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <React.Fragment>
    <Container maxW={1600} p={4} border="3px solid tomato">
      {children}
    </Container>
  </React.Fragment>
);

export default Layout;
