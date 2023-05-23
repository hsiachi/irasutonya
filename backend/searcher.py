from sentence_transformers import SentenceTransformer, util
import numpy as np
import json
import torch
from PIL import Image

class NeuralSearcher:
    
    def __init__(self):
        self.model = SentenceTransformer('clip-ViT-B-32-multilingual-v1')
        self.model.load_state_dict(torch.load('./ckpts/text_epoch2.pt'))
        # self.name_embs = np.load('../data/data/name_emb.npy')
        # self.img_embs = np.load('../data/data/img_emb.npy')
        
        self.name_embs = np.load('../data/data/name_emb_finetuned.npy')
        self.img_embs = np.load('../data/data/img_emb_finetuned.npy')
        
        self.img_infos = []
        with open('../data/data/data_filtered.jsonl') as f:
            for line in f:
                self.img_infos.append(json.loads(line))
            
    def search(self, query: str, size):
        print('begin to search..')
        text_emb = self.model.encode(query)
        combine = True
        if not combine:
            hits = util.semantic_search(text_emb, self.img_embs, top_k=size)[0]
            # hits = util.semantic_search(text_emb, self.name_embs, top_k=size)[0]
        else:
            img_sims = util.cos_sim(text_emb, self.img_embs)
            name_sims = util.cos_sim(text_emb, self.name_embs)
            combined_sims = 0.5 * name_sims + 0.5 * img_sims
            _, indices = torch.topk(torch.tensor(combined_sims[0]), k=10*size, dim=-1)
            _, img_indices = torch.topk(torch.tensor(img_sims[0]), k=10*size, dim=-1)
            _, name_indices = torch.topk(torch.tensor(name_sims[0]), k=10*size, dim=-1)

            # print(img_sims[0][indices])
            # print(name_sims[0][indices])
            cnt = 0
            hits = []
            img_indices = set(img_indices.tolist())
            name_indices = set(name_indices.tolist())

            for idx in indices.tolist():
                if idx not in img_indices or idx not in name_indices:
                    continue
                cnt += 1
                hits.append({'corpus_id': idx})
                if cnt == size:
                    break
        
        res = {'data': []}
        for hit in hits:
            idx = hit['corpus_id']
            info = self.img_infos[idx]
            # res['data'].append({'name': info['name'], 'image': info['image_urls'][0]})
            res['data'].append({'name': info['name'], 'image': info['images'][0]['path']})

        print(res)

        res['status'] = 200
        return res
    