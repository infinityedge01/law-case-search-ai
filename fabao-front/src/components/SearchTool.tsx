import React, { useState } from 'react';
import { Button, Form, Header, Segment, TextArea, Message, Input, Dropdown, Icon, Label } from 'semantic-ui-react';
import styles from './SearchTool.module.less';
import { apiPost } from '@/utils/callAPI';
import { json } from 'stream/consumers';
import { parse } from 'path';

// 关键词组类型定义
interface KeywordGroup {
  id: number;
  keyword1: string;
  keyword2: string;
  relation: 'AND' | 'OR';
}

const SearchTool: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAutoInstructions, setShowAutoInstructions] = useState(true);
  const [showManualInstructions, setShowManualInstructions] = useState(true);

  const [searchMode, setSearchMode] = useState<'auto' | 'manual'>('auto');

  // 手动检索相关状态
  const [keywordGroups, setKeywordGroups] = useState<KeywordGroup[]>([
    { id: 1, keyword1: '', keyword2: '', relation: 'AND' }
  ]);
  const [groupCounter, setGroupCounter] = useState(2);

  const handleDismissAuto = () => {
    setShowAutoInstructions(false);
  };
  const handleDismissManual = () => {
    setShowManualInstructions(false);
  };

  const handleSubmit = () => {
    setIsSearching(true);

    if (searchMode === 'auto') {
      if (!searchText.trim()) return;
      // 自动检索逻辑
      console.log('自动检索内容:', searchText);
      apiPost('/search/auto', { text: searchText })
        .then(response => {

          if (response.error) {
            console.error('自动检索错误:', response.error);
            setIsSearching(false);
            return;
          }
          // 处理自动检索结果
          console.log('自动检索结果:', response.data);
          setKeywordGroups(response.data);
          // 使用服务器端代理请求来避免CORS问题
          apiPost('/proxy/token', { 
            data: null,
          })
          .then(proxyResponse => {
            if (proxyResponse.error) {
              console.error('代理检索错误:', proxyResponse.error);
            } else {
              console.log('代理检索结果:', proxyResponse.data);
              // 处理代理结果
            }
          })
          .catch(error => {
            console.error('代理请求错误:', error);
          });
        })
        .catch(error => {
          console.error('自动检索错误:', error);
        }).finally(() => {
          setIsSearching(false);
        });
    } else {
      // 手动检索逻辑
      const validGroups = keywordGroups.filter(group =>
        group.keyword1.trim() !== '' || group.keyword2.trim() !== ''
      );

      if (validGroups.length === 0) return;
      console.log('手动检索关键词组:', validGroups);
      setIsSearching(false);
    }
    
  };

  // 关键词组操作函数
  const handleKeywordChange = (id: number, field: 'keyword1' | 'keyword2', value: string) => {
    // 不允许输入空白字符
    const sanitizedValue = value.replace(/\s+/g, '');

    setKeywordGroups(groups =>
      groups.map(group =>
        group.id === id ? { ...group, [field]: sanitizedValue } : group
      )
    );
  };

  const handleRelationChange = (id: number, value: 'AND' | 'OR') => {
    setKeywordGroups(groups =>
      groups.map(group =>
        group.id === id ? { ...group, relation: value } : group
      )
    );
  };

  const addKeywordGroup = () => {
    if (keywordGroups.length >= 5) return;

    setKeywordGroups(groups => [
      ...groups,
      { id: groupCounter, keyword1: '', keyword2: '', relation: 'AND' }
    ]);
    setGroupCounter(c => c + 1);
  };

  const removeKeywordGroup = (id: number) => {
    if (keywordGroups.length <= 1) return;

    setKeywordGroups(groups => groups.filter(group => group.id !== id));
  };

  const relationOptions = [
    { key: 'AND', text: '并且', value: 'AND' },
    { key: 'OR', text: '或者', value: 'OR' }
  ];

  return (
    <>
      <Header
        className={styles.header}
        block
        as="h4"
        content="案例检索"
        icon="search"
      />

      <Segment attached className={styles.searchModeSelector}>
        <Button.Group fluid>
          <Button
            active={searchMode === 'auto'}
            onClick={() => setSearchMode('auto')}
          >
            <Icon name="idea" /> 自动检索
          </Button>
          <Button
            active={searchMode === 'manual'}
            onClick={() => setSearchMode('manual')}
          >
            <Icon name="settings" /> 手动检索
          </Button>
        </Button.Group>
      </Segment>

      <Segment attached="bottom" className={styles.searchContainer}>
        {searchMode === 'auto' && (
          <>
            {showAutoInstructions && (
              <Message info className={styles.instructions} onDismiss={handleDismissAuto}>
                <Message.Header>
                  如何使用自动检索
                </Message.Header>
                <p>
                  <>
                    请在下方输入框中输入你的详细检索要求，例如案件特征，关键信息等。
                    <br />
                    系统会根据你的输入自动生成检索关键词。
                  </>
                </p>
              </Message>
            )}
            <Form>
              <>
                <Form.Field>
                  <TextArea
                    placeholder="请输入案件描述或关键信息..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    rows={8}
                    className={styles.searchInput}
                  />
                </Form.Field>

                <Button
                  primary
                  fluid
                  size="large"
                  type="submit"
                  loading={isSearching}
                  disabled={isSearching || !searchText.trim()}
                  className={styles.submitButton}
                  onClick={handleSubmit}
                >
                  开始生成检索
                </Button>
              </>
            </Form>
          </>
        )}
        {searchMode === 'manual' && (
          <>
            {showManualInstructions && (
              <Message info className={styles.instructions} onDismiss={handleDismissManual}>
                <Message.Header>
                  如何使用手动检索
                </Message.Header>
                <p>
                  <>
                    请在下方输入框中输入检索关键词，每组包含两个关键词和一个逻辑关系。
                    <br />
                    可以添加或删除关键词组，最少1组，最多5组。关键词不能包含空格。
                  </>
                </p>
              </Message>
            )}
            <Form>
              <>
                <div className={styles.keywordGroupsContainer}>
                  {keywordGroups.map((group, index) => (
                    <div key={group.id} className={styles.keywordGroup}>
                      <div className={styles.keywordInputs}>
                        <>
                          第 {index + 1} 组
                        </>
                        <Input
                          placeholder="关键词1"
                          value={group.keyword1}
                          onChange={(e) => handleKeywordChange(group.id, 'keyword1', e.target.value)}
                          className={styles.keywordInput}
                        />

                        <Dropdown
                          selection
                          options={relationOptions}
                          value={group.relation}
                          onChange={(_, data) => handleRelationChange(group.id, data.value as 'AND' | 'OR')}
                          className={styles.relationDropdown}
                        />

                        <Input
                          placeholder="关键词2"
                          value={group.keyword2}
                          onChange={(e) => handleKeywordChange(group.id, 'keyword2', e.target.value)}
                          className={styles.keywordInput}
                        />
                        <Icon
                          name="delete"
                          onClick={() => removeKeywordGroup(group.id)}
                          disabled={keywordGroups.length <= 1}
                          className={styles.deleteIcon}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {keywordGroups.length < 5 && (
                  <Button
                    icon="plus"
                    content="添加关键词组"
                    onClick={addKeywordGroup}
                    className={`${styles.addGroupButton} primary`}
                  />
                )}

                <Button
                  primary
                  fluid
                  size="large"
                  type="submit"
                  loading={isSearching}
                  disabled={isSearching || !keywordGroups.some(g => g.keyword1 || g.keyword2)}
                  className={styles.submitButton}
                  onClick={handleSubmit}
                >
                  开始关键词检索
                </Button>
              </>
            </Form>
          </>

        )}


      </Segment>
    </>
  );
};

export default SearchTool;