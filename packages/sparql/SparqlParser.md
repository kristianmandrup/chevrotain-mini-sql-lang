# Sparql Parser

The Sparql parser contains a basic parser for working with SQL-like queries, in this case SPARQL, a query language for graph/network data structures.

## Select query

```ts
  SelectQuery = this.RULE('SelectQuery', () => {
    log('SelectQuery');
    this.SUBRULE(this.SelectClause);
    this.MANY(() => this.SUBRULE(this.DatasetClause));
    this.SUBRULE(this.WhereClause);
    this.SUBRULE(this.SolutionModifier);
  });
```

## Select clause

```ts
  SelectClause = this.RULE('SelectClause', () => {
    log('SelectClause');
    this.CONSUME(sparqlTokenMap.SELECT);
    this.OPTION(() =>
      this.OR([
        { ALT: () => this.CONSUME(sparqlTokenMap.DISTINCT) },
        { ALT: () => this.CONSUME(sparqlTokenMap.REDUCED) },
      ])
    );
    this.OR1([
      {
        ALT: () => {
          this.AT_LEAST_ONE(() =>
            this.OR2([
              { ALT: () => this.SUBRULE(this.Var) },
              {
                ALT: () => {
                  this.CONSUME(sparqlTokenMap.LParen);
                  this.SUBRULE(this.Expression);
                  this.CONSUME(sparqlTokenMap.AS);
                  this.SUBRULE1(this.Var);
                  this.CONSUME(sparqlTokenMap.RParen);
                },
              },
            ])
          );
        },
      },
      { ALT: () => this.CONSUME(sparqlTokenMap.Star) },
    ]);
  });
```

## Where clause

```ts
  WhereClause = this.RULE('WhereClause', () => {
    log('WhereClause');
    this.OPTION(() => this.CONSUME(sparqlTokenMap.WHERE));
    this.SUBRULE(this.GroupGraphPattern);
  });
```
