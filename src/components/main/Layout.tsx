import { Container } from '@chakra-ui/react';
import React from 'react';
import Alert from './Alert';

type LayoutProps = {
  children: React.ReactElement;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <React.Fragment>
    <Alert />
    <Container maxW={1600} p={4}>
      {children}
    </Container>
  </React.Fragment>
);

export default Layout;
