# OnCyber-scenes Backend

## Call example:

```bash
curl http://localhost:3000/api/generate --form file='@./Screenshot.png' --form "amount=1" --form "address=0xBeb171bA24e66014F356Bca0DB05329EFea14964"

Response:
{
  "status": "success",
  "ipfsHashMetadata": "QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8",
  "ipfsHashImage": "QmSKo96CbuaAJiEb6XRTfp2Va4snVnYR2bDyZ95qCxCWKL",
  "signature": "0xe3e0d41b491aef629240488e3815f9897a19f1b5d2bc91130d5baff92c52196027f07d6fe08eb6bc1b56a695ecbbe82280013892b2bd57d309cf2002bd6e21851b"
}
```
