import json

data = []
with open('../data/data/data.jsonl') as f:
    for line in f:
        a = json.loads(line)
        data.append(a)

cnt = 0
with open('../data/data/data_filtered.jsonl', 'w') as outf:
    for d in data:
        if d['name'] and d['name'] != '■':
            cnt += 1
            json.dump(d, outf, ensure_ascii=False)
            outf.write('\n')
    
print(f'before filtered:{len(data)}, after filtered:{cnt}')
    