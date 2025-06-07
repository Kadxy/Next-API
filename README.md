# API Grip - Powerful API Gateway, Access AI models anywhere

## Features

- 🌍 Globally distributed
- 🔥 High performance
- 💰 Cost effective
- 🔒 Secure

## How to use

### Regions & Endpoints

Choose the region closest to your server to reduce latency.

| Region           | Endpoint                            |
| ---------------- | ----------------------------------- |
| Global           | <https://api.apigrip.com>           |
| Shanghai, China  | <https://cn-shanghai.apigrip.com>   |
| Los Angeles, USA | <https://us-losangeles.apigrip.com> |
| New York, USA    | <https://us-newyork.apigrip.com>    |
| Tokyo, Japan     | <https://jp-tokyo.apigrip.com>      |

### Authentication

Authentication is done via Bearer Token.

```bash
curl -X POST https://api.apigrip.com/v1/chat/completions \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'
```

### Pricing

You can find the pricing in the [pricing page](https://apigrip.com/pricing).\

### API Key

API Key is used to authenticate requests.

You can create multiple API keys and bind them to different wallets.

All requests using the API key will be billed to the wallet you selected.

Your API key is only visible when you create it, you can't retrieve it later,
API Grip only stores the hash of your API key for authentication.

_WARNING: If you lose your API key, please roll(or delete) your API key immediately._

### Wallet

API Grip uses wallet to manage billing.

Once you create an account, you will be assigned a wallet owned by you.

An account can only own one wallet, but you can join multiple wallets as a member.

As wallet owner, you can invite your team members to your wallet and set credit limit for each member.

Wallet members are able to create API keys bound to the wallet, all requests using the API key will be billed to the wallet.

Wallet owner can access every usage log of the wallet, including the IP address, API key name and usage.

_NOTE: Once the member leaves the wallet, API key bound to the wallet will be invisible and invalidated permanently._

### Wallet Limit & Upgrade

Rate limit is per wallet, not per API key. Different wallets have different rate limits.

| Wallet Type | QPS(Query Per Second) | TPM(Token Per Minute) | Members | Upgrade Conditions  |
| ----------- | --------------------- | --------------------- | ------- | ------------------- |
| Free        | 3                     | 1M                    | 1       | Register an account |
| Plus        | 10                    | 10M                   | 2       | Recharge over ¥100  |
| Pro         | 30                    | 50M                   | 5       | Recharge over ¥2000 |
| Max         | 100                   | ∞                     | 8       | Recharge over ¥5000 |
| Enterprise  | ∞                     | ∞                     | ∞       | Invitation-only     |

### Response Format

We use the same response format as OpenAI.

For more details, please refer to the [OpenAI API Reference](https://platform.openai.com/docs/api-reference).
