# OnCyber-scenes Backend

## Call example:

```bash
curl http://localhost:3000/api/generate \
  --header "Content-Type: application/json" \
  --request POST \
  --data '{"nonce":"0","amount": "1","address":"0xBeb171bA24e66014F356Bca0DB05329EFea14964","hash":"QmU8nZikePgnvqv15wwRrwCuzeJVPbzmZ4HPwDs8qy622A"}'

Response:
{
  "status": "success",
  "ipfsHashMetadata": "QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8",
  "signature": "0x5aadfb09271007b5e118f9ef914d3a24e362ef2d2e32cee4fe9d93003eace98c26e913f8f4d24dad358e1fa88b738b4051cbd72a160b8ace1dc610e4a7084e5b1b"
}
```
