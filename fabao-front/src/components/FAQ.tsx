import React, { memo } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import styles from './FAQ.module.less';
import { EmojiRenderer } from '@/components/EmojiRenderer';

const FAQ: React.FC = () => {
  return (
    <>
      <Header
        className={styles.header}
        block
        as="h4"
        content="常见问题"
        attached="top"
        icon="info"
      />
      <Segment attached="bottom">
      </Segment>
    </>
  );
};

export default memo(FAQ);