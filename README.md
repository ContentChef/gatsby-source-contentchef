### Usage

```javascript
plugins: [{
  resolve: 'gatsby-source-contentchef',
  options: {
    apiKey: 'your api key',
    host: 'contentchef endpoint',
    spaceId: 'your space',
    channel: 'your channel',
    queries: [query1, query2] // needed to retrieve the content/s you want
  }
}]
```

```typescript

interface Query {
  id: string;
  publicId?: string[] | string;
  contentDefinition?: string[] | string;
  repositories?: string[];
  legacyMetadata?: boolean;
  tags?: string[] | string;
  propFilters?: IPropFilter;
  sorting?: ISortingField[] | string;
}

interface IPropFilter {
  condition: LogicalOperators;
  items: IPropFilterItem[];
}

interface IPropFilterItem {
  field: string;
  operator: Operators;
  value: any;
}

enum LogicalOperators {
  AND = 'AND',
  OR = 'OR',
}

enum Operators {
  CONTAINS = 'CONTAINS',
  CONTAINS_IC = 'CONTAINS_IC',
  EQUALS = 'EQUALS',
  EQUALS_IC = 'EQUALS_IC',
  IN = 'IN',
  IN_IC = 'IN_IC',
  STARTS_WITH = 'STARTS_WITH',
  STARTS_WITH_IC = 'STARTS_WITH_IC',
}

interface ISortingField {
  fieldName: 'publicId' | 'onlineDate' | 'offlineDate' | string;
  ascending: boolean;
}

```