# Entertainment Project

娱乐项目的 React Native 应用。

## 多语言支持使用方法

本项目已集成多语言支持功能，目前支持中文和英文两种语言。以下是如何在组件中使用多语言功能：

### 在组件中使用翻译

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('home.welcome')}</Text>
      <Text>{t('common.confirm')}</Text>
    </View>
  );
}
```

### 切换语言

用户可以通过 "设置" 页面来切换语言。在"我的"页面有进入设置页面的入口，其中包含语言设置选项。

语言设置是全局性的，一处修改，整个应用都会自动更新语言。

### 添加新的翻译

要添加新的翻译，请按照以下步骤操作：

1. 在 `src/i18n/locales` 目录下添加新的语言文件，例如 `fr.ts`
2. 在 `src/i18n/index.ts` 中导入新语言文件并添加到 resources 对象中
3. 在 `src/pages/Settings/index.tsx` 中的 languageOptions 添加新语言选项

### 翻译文件结构

翻译文件使用嵌套的对象结构，按功能区域组织：

```tsx
export const zh = {
  common: {
    confirm: '确认',
    cancel: '取消',
    // ...
  },
  navigation: {
    home: '首页',
    // ...
  },
  // ...
};
```

### 工作原理

1. 应用初始化时，会从本地存储中获取上次设置的语言，如果没有则使用默认语言（中文）
2. 用户切换语言后，新的语言设置会保存到本地存储中，并在下次启动时自动使用
3. 所有文本都通过翻译函数 `t` 获取，因此只需在设置页面切换语言，整个应用的文本会自动更新

## 其他项目说明

...
