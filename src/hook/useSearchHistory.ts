// 利用本地存储，记录搜索记录

import { useState, useEffect } from 'react';

import { SEARCH_HISTORY_KEY, MAX_SEARCH_HISTORY_ITEMS } from '../constants/constants';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export default function useSearchHistory(name: string) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const realSearchHistoryKey = SEARCH_HISTORY_KEY + '_' + name; 
  // initialize: 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem(realSearchHistoryKey);
    setHistory(saved ? JSON.parse(saved) : []);
  }, []);

  // 添加新记录
  // 注意这里如果加入已有的记录，会把旧的记录抬到第一个
  // 有长度限制
  const addHistory = (query: string) => {
    console.log(`in addHistory, name: ${name}, query: ${query}`)
    if (query === undefined || query === "") {
      return; 
    }
    console.log(`in addHistory, actually add`)
    const newHistory = [
      { query, timestamp: Date.now() },
      ...history.filter(item => item.query !== query)
    ].slice(0, MAX_SEARCH_HISTORY_ITEMS);
    
    setHistory(newHistory);
    localStorage.setItem(realSearchHistoryKey, JSON.stringify(newHistory));
  };

  // 清除历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(realSearchHistoryKey);
  };

  return { history, addHistory, clearHistory };
}