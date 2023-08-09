import { uuid } from 'uuidv4'

export const getTokenDetailByPosition = (data: any) => {
  const rowsFiltered = data.filter((row: any) => {
    return (
      ((row.metric.includes('balances') || row.metric.includes('unclaim')) &&
        !row.protocol.includes('Wallet')) ||
      row.metric_code === 'm21' ||
      row.metric_code === 'm22' ||
      row.metric_code === 'm23' ||
      row.metric_code === 'm24' ||
      row.metric_code === 'm25' ||
      row.metric_code === 'm26'
    )
  })

  const commonCards = rowsFiltered
    .reduce((acc: any, obj: any): any => {
      const cardType = obj?.type?.trim()
      if (cardType === 'CDP') {
        return acc
      }

      const dao = obj?.dao?.trim()
      const tokenSymbol = obj?.token_symbol?.trim()
      const position = obj?.lptoken_name?.trim()
      const blockchain = obj?.blockchain?.trim()
      const protocol = obj?.protocol?.trim()
      const metric = obj?.metric?.trim()

      if (!dao || !tokenSymbol || !position || !blockchain || !protocol || !metric) {
        return acc
      }

      let categoryName = 'Farming funds'
      if (metric.includes('unclaim')) {
        categoryName = 'Unclaimed rewards'
      }
      if (metric.includes('balance') && protocol.includes('Wallet')) {
        categoryName = 'Wallet'
      }

      const cardFound = acc.find((card: any) => {
        return (
          card.dao === dao &&
          card.blockchain === blockchain &&
          card.protocol === protocol &&
          card.position === position
        )
      })

      const balance = obj.bal_1 ? obj.bal_1 : 0
      const price = obj.next_period_first_price ? obj.next_period_first_price : 0

      if (cardFound) {
        const categoryFound = cardFound?.categories.find((category: any) => {
          return category.name === categoryName
        })

        if (categoryFound) {
          categoryFound.tokens.push({
            symbol: tokenSymbol,
            balance,
            usdValue: balance * price
          })
        } else {
          cardFound.categories.push({
            name: categoryName,
            tokens: [
              {
                symbol: tokenSymbol,
                balance,
                usdValue: balance * price
              }
            ]
          })
        }
      } else {
        acc.push({
          dao,
          blockchain,
          protocol,
          position,
          cardType: 'common',
          categories: [
            {
              name: categoryName,
              tokens: [
                {
                  symbol: tokenSymbol,
                  balance,
                  usdValue: balance * price
                }
              ]
            }
          ]
        })
      }

      return acc
    }, [])
    .map((card: any) => {
      card.categories.forEach((category: any) => {
        card.totalUsdValue =
          (card.totalUsdValue || 0) +
          category.tokens.reduce((acc: any, obj: any) => {
            return acc + obj.usdValue
          }, 0)
      })
      return card
    })

  const metricsCards = rowsFiltered.reduce((acc: any, obj: any): any => {
    const metricCode = obj?.metric_code?.trim()

    if (
      metricCode !== 'm24' &&
      metricCode !== 'm23' &&
      metricCode !== 'm22' &&
      metricCode !== 'm21'
    ) {
      return acc
    }

    const dao = obj?.dao?.trim()
    const blockchain = obj?.blockchain?.trim()
    const protocol = obj?.protocol?.trim()
    const position = obj?.lptoken_name?.trim()
    const tokenSymbol = obj?.token_symbol?.trim()

    if (!dao || !blockchain || !protocol || !position) {
      return acc
    }

    const positionType = 'Ratios'

    let ratioName = ''
    if (!tokenSymbol && metricCode === 'm24') {
      ratioName = 'Collateral price drop to liquidation'
    }
    if (!tokenSymbol && metricCode === 'm23') {
      ratioName = 'Collateral liquidation price'
    }
    if (!tokenSymbol && metricCode === 'm22') {
      ratioName = 'Minimum collateral ratio'
    }
    if (!tokenSymbol && metricCode === 'm21') {
      ratioName = 'Collateral ratio'
    }

    const cardFound = acc.find((card: any) => {
      return (
        card.dao === dao &&
        card.blockchain === blockchain &&
        card.protocol === protocol &&
        card.position === position
      )
    })

    const value = obj.metric_value ? obj.metric_value : 0

    if (cardFound) {
      const categoryFound = cardFound?.categories.find((category: any) => {
        return category.name === positionType
      })

      if (categoryFound) {
        categoryFound?.ratios?.push({
          name: ratioName,
          value
        })
      } else {
        cardFound?.categories?.push({
          name: positionType,
          ratios: [
            {
              name: ratioName,
              value
            }
          ]
        })
      }
    } else {
      acc.push({
        dao,
        blockchain,
        protocol,
        position,
        cardType: 'metrics',
        categories: [
          {
            name: positionType,
            ratios: [
              {
                name: ratioName,
                value
              }
            ]
          }
        ]
      })
    }

    return acc
  }, [])

  const vaultCards = rowsFiltered
    .reduce((acc: any, obj: any): any => {
      const cardType = obj?.type?.trim()

      if (cardType === 'Standard') {
        return acc
      }

      const dao = obj?.dao?.trim()
      const position = obj?.lptoken_name?.trim()
      const blockchain = obj?.blockchain?.trim()
      const protocol = obj?.protocol?.trim()
      const tokenSymbol = obj?.token_symbol?.trim()

      if (!dao || !position || !blockchain || !protocol || !tokenSymbol) {
        return acc
      }

      const balance = obj.bal_1 ? obj.bal_1 : 0
      const categoryName = balance > 0 ? 'Farming funds: collateral' : 'Farming funds: debt'

      const cardFound = acc.find((card: any) => {
        return (
          card.blockchain === blockchain && card.protocol === protocol && card.position === position
        )
      })

      const price = obj.next_period_first_price ? obj.next_period_first_price : 0

      if (cardFound) {
        const categoryFound = cardFound?.categories.find((category: any) => {
          return category.name === categoryName
        })

        if (categoryFound) {
          categoryFound?.tokens?.push({
            symbol: tokenSymbol,
            balance,
            usdValue: balance * price
          })
        } else {
          cardFound?.categories?.push({
            name: categoryName,
            tokens: [
              {
                symbol: tokenSymbol,
                balance,
                usdValue: balance * price
              }
            ]
          })
        }
      } else {
        acc.push({
          dao,
          blockchain,
          protocol,
          position,
          cardType: 'metrics',
          categories: [
            {
              name: categoryName,
              tokens: [
                {
                  symbol: tokenSymbol,
                  balance,
                  usdValue: balance * price
                }
              ]
            }
          ]
        })
      }

      return acc
    }, [])
    .map((card: any) => {
      card.categories.forEach((category: any) => {
        card.totalUsdValue =
          (card.totalUsdValue || 0) +
          category.tokens.reduce((acc: any, obj: any) => {
            return acc + obj.usdValue
          }, 0)
      })
      return card
    })

  const mergeAllCards = (cards1: any, cards2: any, cards3: any) => {
    const cards = cards1.concat(cards2).concat(cards3)
    const cardsMerged = cards.reduce((acc: any, obj: any): any => {
      const cardFound = acc.find((card: any) => {
        return (
          card.dao === obj.dao &&
          card.blockchain === obj.blockchain &&
          card.protocol === obj.protocol &&
          card.position === obj.position
        )
      })

      if (cardFound) {
        cardFound.categories = cardFound.categories.concat(obj.categories)
      } else {
        acc.push(obj)
      }

      return acc
    }, [])

    return cardsMerged
  }

  const allCards = mergeAllCards(commonCards, vaultCards, metricsCards)
  const allCardsWithID = allCards.map((card: any) => {
    card.id = uuid()
    return card
  })

  const allCardsSortedByTotalUsdValue = allCardsWithID.sort((a: any, b: any) => {
    return b.totalUsdValue - a.totalUsdValue
  })

  return allCardsSortedByTotalUsdValue
}
