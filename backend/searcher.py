from sentence_transformers import SentenceTransformer, util
import numpy as np
import json
from PIL import Image

class NeuralSearcher:
    
    def __init__(self):
        self.model = SentenceTransformer('clip-ViT-B-32-multilingual-v1')
        self.name_embs = np.load('../data/data/name_emb.npy')
        self.img_embs = np.load('../data/data/img_emb.npy')
        self.img_infos = []
        with open('../data/data/data_filtered.jsonl') as f:
            for line in f:
                self.img_infos.append(json.loads(line))
            
    def search(self, query: str, size):
        print('begin to search..')
        text_emb = self.model.encode(query)
        hits = util.semantic_search(text_emb, self.img_embs, top_k=size)[0]
        
        res = {'data': []}
        for hit in hits:
            idx = hit['corpus_id']
            info = self.img_infos[idx]
            res['data'].append({'name': info['name'], 'image': info['image_urls'][0]})

        res['status'] = 200
        return res
    